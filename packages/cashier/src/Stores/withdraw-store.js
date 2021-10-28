import React from 'react';
import { action, computed, observable } from 'mobx';
import { localize, Localize } from '@deriv/translations';
import { getDecimalPlaces, getMinWithdrawal, validNumber } from '@deriv/shared';

export default class WithdrawStore {
    constructor({ WS, root_store }) {
        this.root_store = root_store;
        this.WS = WS;
    }

    @observable blockchain_address = '';
    @observable container = 'withdraw';
    @observable error = this.root_store.modules.cashier?.error_store;
    @observable is_10k_withdrawal_limit_reached = undefined;
    @observable iframe = this.root_store.modules.cashier?.iframe_store;
    @observable is_withdraw_confirmed = false;
    @observable verification = this.root_store.modules.cashier?.verification_store;
    @observable withdraw_amount = '';

    @action.bound
    setIsWithdrawConfirmed(is_withdraw_confirmed) {
        this.is_withdraw_confirmed = is_withdraw_confirmed;

        if (is_withdraw_confirmed)
            this.setWithdrawAmount(this.root_store.modules.cashier.crypto_fiat_converter_store.converter_from_amount);

        if (!is_withdraw_confirmed && this.verification) {
            this.verification.clearVerification('payment_withdraw');
        }
    }

    @action.bound
    setWithdrawAmount(amount) {
        this.withdraw_amount = amount;
    }

    @action.bound
    async requestWithdraw(verification_code) {
        if (!this.root_store.client.is_logged_in) {
            return;
        }

        if (!this.root_store.modules.cashier.crypto_fiat_converter_store.converter_from_amount) {
            this.root_store.modules.cashier.crypto_fiat_converter_store.setConverterFromError(
                localize('This field is required.')
            );
            return;
        }

        await this.WS.cryptoWithdraw({
            address: this.blockchain_address,
            amount: +this.root_store.modules.cashier.crypto_fiat_converter_store.converter_from_amount,
            verification_code,
            dry_run: 1,
        }).then(response => {
            if (response.error) {
                this.root_store.modules.cashier.error_dialog.setErrorMessage(response.error.message);
            } else {
                this.saveWithdraw(verification_code);
            }
        });
    }

    @action.bound
    async saveWithdraw(verification_code) {
        this.error.setErrorMessage('');
        await this.WS.cryptoWithdraw({
            address: this.blockchain_address,
            amount: +this.root_store.modules.cashier.crypto_fiat_converter_store.converter_from_amount,
            verification_code,
        }).then(response => {
            if (response.error) {
                this.error.setErrorMessage(response.error);
                if (verification_code) {
                    // clear verification code on error
                    this.verification.clearVerification('payment_withdraw');
                }
                this.resetWithrawForm();
            } else {
                this.setIsWithdrawConfirmed(true);
            }
        });
    }

    @action.bound
    resetWithrawForm() {
        this.setBlockchainAddress('');
        this.root_store.modules.cashier.crypto_fiat_converter_store.setConverterFromAmount('');
        this.root_store.modules.cashier.crypto_fiat_converter_store.setConverterToAmount('');
        this.verification.clearVerification('payment_withdraw');
    }

    @action.bound
    setBlockchainAddress(address) {
        this.blockchain_address = address;
    }

    @action.bound
    willMountWithdraw(verification_code) {
        if (verification_code) {
            this.verification.clearVerification('payment_withdraw');
        }
    }

    @action.bound
    async onMountWithdraw(verification_code) {
        this.root_store.modules.cashier.general_store.setLoading(true);
        const strRegExp = /^\w{8,128}$/;
        let response_cashier;

        if (strRegExp.test(verification_code)) {
            response_cashier = await this.WS.cryptoWithdraw({
                address: this.blockchain_address,
                amount: +this.root_store.modules.cashier.crypto_fiat_converter_store.converter_from_amount,
                verification_code,
                dry_run: 1,
            });
        } else {
            response_cashier = { error: { code: 'InvalidToken', message: 'Your token has expired or is invalid.' } };
        }

        if (response_cashier.error.code === 'InvalidToken') {
            this.error.handleCashierError(response_cashier.error);
            this.root_store.modules.cashier.general_store.setLoading(false);
            this.iframe.setSessionTimeout(true);
            this.iframe.clearTimeoutCashierUrl();
            if (verification_code) {
                // clear verification code on error
                this.verification.clearVerification('payment_withdraw');
            }
        } else {
            this.root_store.modules.cashier.general_store.setLoading(false);
        }
        if (this.error) {
            this.error.setErrorMessage(this.error, this.onMountWithdraw);
        }
    }

    @computed
    get is_withdrawal_locked() {
        if (!this.root_store.client.account_status?.status) return false;
        const { authentication } = this.root_store.client.account_status;
        const need_poi = authentication.needs_verification.includes('identity');

        const need_authentication = this.error.is_ask_authentication && need_poi;

        return (
            this.root_store.client.is_withdrawal_lock ||
            need_authentication ||
            this.error.is_ask_financial_risk_approval
        );
    }

    @action.bound
    async check10kLimit() {
        const remainder = (await this.root_store.client.getLimits())?.get_limits?.remainder;
        const min_withdrawal = getMinWithdrawal(this.root_store.client.currency);
        const is_limit_reached = !!(typeof remainder !== 'undefined' && +remainder < min_withdrawal);
        this.set10kLimitation(is_limit_reached);
    }

    @action.bound
    set10kLimitation(is_limit_reached) {
        this.is_10k_withdrawal_limit_reached = is_limit_reached;
    }

    @action.bound
    setWithdrawPercentageSelectorResult(amount) {
        if (amount > 0) {
            this.root_store.modules.cashier.crypto_fiat_converter_store.setConverterFromAmount(amount);
            this.validateWithdrawFromAmount();
            this.root_store.modules.cashier.crypto_fiat_converter_store.onChangeConverterFromAmount(
                { target: { value: amount } },
                this.root_store.client.currency,
                this.root_store.client.current_fiat_currency || 'USD'
            );
        }
        this.root_store.modules.cashier.crypto_fiat_converter_store.setIsTimerVisible(false);
        this.root_store.modules.cashier.general_store.percentageSelectorSelectionStatus(false);
    }

    @action.bound
    validateWithdrawFromAmount() {
        let error_message = '';

        const { balance, currency, website_status } = this.root_store.client;
        const min_withdraw_amount = website_status.crypto_config[currency].minimum_withdrawal;

        if (this.root_store.modules.cashier.crypto_fiat_converter_store.converter_from_amount) {
            const { is_ok, message } = validNumber(
                this.root_store.modules.cashier.crypto_fiat_converter_store.converter_from_amount,
                {
                    type: 'float',
                    decimals: getDecimalPlaces(currency),
                }
            );
            if (!is_ok) error_message = message;

            if (+balance < +this.root_store.modules.cashier.crypto_fiat_converter_store.converter_from_amount)
                error_message = localize('Insufficient funds');

            if (
                +this.root_store.modules.cashier.crypto_fiat_converter_store.converter_from_amount <
                +min_withdraw_amount
            ) {
                error_message = (
                    <Localize
                        i18n_default_text='The minimum withdrawal amount allowed is {{min_withdraw_amount}} {{currency}}'
                        values={{ min_withdraw_amount, currency: this.root_store.client.currency }}
                    />
                );
            }
        }
        this.root_store.modules.cashier.crypto_fiat_converter_store.setConverterFromError(error_message);
    }

    @action.bound
    validateWithdrawToAmount() {
        let error_message = '';
        const { current_fiat_currency } = this.root_store.client;

        if (this.root_store.modules.cashier.crypto_fiat_converter_store.converter_to_amount) {
            const { is_ok, message } = validNumber(
                this.root_store.modules.cashier.crypto_fiat_converter_store.converter_to_amount,
                {
                    type: 'float',
                    decimals: getDecimalPlaces(current_fiat_currency),
                }
            );
            if (!is_ok) error_message = message;
        }

        this.root_store.modules.cashier.crypto_fiat_converter_store.setConverterToError(error_message);
    }

    @computed
    get account_platform_icon() {
        const platform_icon = this.root_store.client.account_list.find(
            acc => this.root_store.client.loginid === acc.loginid
        ).icon;

        return platform_icon;
    }
}
