import React from 'react';
import { action, computed, observable } from 'mobx';
import { localize, Localize } from '@deriv/translations';
import { getDecimalPlaces, getMinWithdrawal, validNumber } from '@deriv/shared';
import ErrorStore from './error-store';
import IframeStore from './iframe-store';
import VerificationStore from './verification-store';

export default class WithdrawStore {
    constructor({ WS, root_store }) {
        this.root_store = root_store;
        this.WS = WS;
    }

    @observable blockchain_address = '';
    @observable container = 'withdraw';
    @observable error = new ErrorStore();
    @observable is_10k_withdrawal_limit_reached = undefined;
    @observable iframe = new IframeStore({ root_store: this.root_store, WS: this.WS });
    @observable is_withdraw_confirmed = false;
    @observable verification = new VerificationStore({ root_store: this.root_store, WS: this.WS });
    @observable withdraw_amount = '';
    @observable max_withdraw_amount = 0;

    @action.bound
    setIsWithdrawConfirmed(is_withdraw_confirmed) {
        const { converter_from_amount } = this.root_store.modules.cashier.crypto_fiat_converter_store;
        this.is_withdraw_confirmed = is_withdraw_confirmed;

        if (is_withdraw_confirmed) this.setWithdrawAmount(converter_from_amount);

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
        const { client, modules } = this.root_store;
        const { crypto_fiat_converter_store, error_dialog } = modules.cashier;

        if (!client.is_logged_in) {
            return;
        }

        if (!crypto_fiat_converter_store.converter_from_amount) {
            crypto_fiat_converter_store.setConverterFromError(localize('This field is required.'));
            return;
        }

        await this.WS.cryptoWithdraw({
            address: this.blockchain_address,
            amount: +crypto_fiat_converter_store.converter_from_amount,
            verification_code,
            dry_run: 1,
        }).then(response => {
            if (response.error) {
                error_dialog.setErrorMessage(response.error.message);
            } else {
                this.saveWithdraw(verification_code);
            }
        });
    }

    @action.bound
    async saveWithdraw(verification_code) {
        const { converter_from_amount } = this.root_store.modules.cashier.crypto_fiat_converter_store;

        this.error.setErrorMessage('');
        await this.WS.cryptoWithdraw({
            address: this.blockchain_address,
            amount: +converter_from_amount,
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
        const { setConverterFromAmount, setConverterToAmount } =
            this.root_store.modules.cashier.crypto_fiat_converter_store;
        this.setBlockchainAddress('');
        setConverterFromAmount('');
        setConverterToAmount('');
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
        const { client, modules } = this.root_store;
        const { active_container, is_crypto, onMountCommon, setLoading, setOnRemount } = modules.cashier.general_store;
        const { is_virtual } = client;
        const current_container = active_container;

        setOnRemount(this.onMountWithdraw);
        await onMountCommon();

        this.error.setErrorMessage('');
        this.iframe.setContainerHeight(0);
        setLoading(true);

        if (!this.iframe.is_session_timeout) {
            this.iframe.checkIframeLoaded();
            return;
        }

        // if session has timed out reset everything
        this.iframe.setIframeUrl('');
        if (!verification_code || is_virtual) {
            setLoading(false);
            // if virtual, clear everything and don't proceed further
            // if no verification code, we should request again
            return;
        }

        const response_cashier = await this.WS.authorized.cashier(active_container, {
            verification_code,
        });

        // if tab changed while waiting for response, ignore it
        if (current_container !== active_container) {
            setLoading(false);
            return;
        }
        if (response_cashier.error) {
            this.error.handleCashierError(response_cashier.error);
            setLoading(false);
            this.iframe.setSessionTimeout(true);
            this.iframe.clearTimeoutCashierUrl();
            if (verification_code) {
                // clear verification code on error
                this.verification.clearVerification('payment_withdraw');
            }
        } else if (is_crypto) {
            setLoading(false);
        } else {
            await this.iframe.checkIframeLoaded();
            setLoading(false);
            this.iframe.setIframeUrl(response_cashier.cashier);
            this.iframe.setSessionTimeout(false);
            this.iframe.setTimeoutCashierUrl();
        }
    }

    @action.bound
    async onMountCryptoWithdraw(verification_code) {
        const { crypto_fiat_converter_store, general_store } = this.root_store.modules.cashier;

        general_store.setLoading(true);
        const strRegExp = /^\w{8,128}$/;
        let response_cashier;

        if (strRegExp.test(verification_code)) {
            response_cashier = await this.WS.cryptoWithdraw({
                address: this.blockchain_address,
                amount: +crypto_fiat_converter_store.converter_from_amount,
                verification_code,
                dry_run: 1,
            });
        } else {
            response_cashier = { error: { code: 'InvalidToken', message: 'Your token has expired or is invalid.' } };
        }

        if (response_cashier.error.code === 'InvalidToken') {
            this.error.handleCashierError(response_cashier.error);
            general_store.setLoading(false);
            this.iframe.setSessionTimeout(true);
            this.iframe.clearTimeoutCashierUrl();
            if (verification_code) {
                // clear verification code on error
                this.verification.clearVerification('payment_withdraw');
            }
        } else {
            general_store.setLoading(false);
        }
    }

    @computed
    get is_withdrawal_locked() {
        const { client } = this.root_store;
        const { authentication } = client.account_status;

        if (!client.account_status?.status) return false;
        const need_poi = authentication.needs_verification.includes('identity');
        const need_authentication = this.error.is_ask_authentication && need_poi;

        return client.is_withdrawal_lock || need_authentication || this.error.is_ask_financial_risk_approval;
    }

    @action.bound
    setMaxWithdrawAmount(amount) {
        this.max_withdraw_amount = amount;
    }

    @action.bound
    async check10kLimit() {
        const { client } = this.root_store;

        const remainder = (await client.getLimits())?.get_limits?.remainder;
        this.setMaxWithdrawAmount(remainder);
        const min_withdrawal = getMinWithdrawal(client.currency);
        const is_limit_reached = !!(typeof remainder !== 'undefined' && +remainder < min_withdrawal);
        this.set10kLimitation(is_limit_reached);
    }

    @action.bound
    set10kLimitation(is_limit_reached) {
        this.is_10k_withdrawal_limit_reached = is_limit_reached;
    }

    @action.bound
    setWithdrawPercentageSelectorResult(amount) {
        const { client, modules } = this.root_store;
        const { crypto_fiat_converter_store, general_store } = modules.cashier;
        const { currency, current_fiat_currency } = client;

        if (amount > 0) {
            crypto_fiat_converter_store.setConverterFromAmount(amount);
            this.validateWithdrawFromAmount();
            crypto_fiat_converter_store.onChangeConverterFromAmount(
                { target: { value: amount } },
                currency,
                current_fiat_currency || 'USD'
            );
        } else {
            crypto_fiat_converter_store.resetConverter();
        }
        crypto_fiat_converter_store.setIsTimerVisible(false);
        general_store.percentageSelectorSelectionStatus(false);
    }

    @action.bound
    validateWithdrawFromAmount() {
        let error_message = '';

        const { client, modules } = this.root_store;
        const { balance, currency, website_status } = client;
        const { converter_from_amount, setConverterFromError } = modules.cashier.crypto_fiat_converter_store;

        const min_withdraw_amount = website_status.crypto_config[currency].minimum_withdrawal;
        const max_withdraw_amount = +this.max_withdraw_amount > +balance ? +balance : +this.max_withdraw_amount;

        if (converter_from_amount) {
            const { is_ok, message } = validNumber(converter_from_amount, {
                type: 'float',
                decimals: getDecimalPlaces(currency),
            });
            if (!is_ok) error_message = message;

            if (+balance < +converter_from_amount) error_message = localize('Insufficient funds');

            if (+converter_from_amount < +min_withdraw_amount || +converter_from_amount > +max_withdraw_amount) {
                error_message = (
                    <Localize
                        i18n_default_text='The allowed withdraw amount is {{min_withdraw_amount}} to {{max_withdraw_amount}} {{currency}}'
                        values={{
                            min_withdraw_amount,
                            max_withdraw_amount,
                            currency,
                        }}
                    />
                );
            }
        }
        setConverterFromError(error_message);
    }

    @action.bound
    validateWithdrawToAmount() {
        let error_message = '';
        const { client, modules } = this.root_store;
        const { current_fiat_currency } = client;
        const { converter_to_amount, setConverterToError } = modules.cashier.crypto_fiat_converter_store;

        if (converter_to_amount) {
            const { is_ok, message } = validNumber(converter_to_amount, {
                type: 'float',
                decimals: getDecimalPlaces(current_fiat_currency),
            });
            if (!is_ok) error_message = message;
        }

        setConverterToError(error_message);
    }

    @computed
    get account_platform_icon() {
        const { account_list, loginid } = this.root_store.client;
        const platform_icon = account_list.find(acc => loginid === acc.loginid).icon;

        return platform_icon;
    }
}
