import React from 'react';
import { action, computed, observable, makeObservable } from 'mobx';
import { formatMoney, getDecimalPlaces, getMinWithdrawal, isMobile, validNumber } from '@deriv/shared';
import { localize } from '@deriv/translations';
import { ReadMore } from '@deriv/components';
import Constants from 'Constants/constants';
import ErrorStore from './error-store';
import VerificationStore from './verification-store';

export default class WithdrawStore {
    constructor({ WS, root_store }) {
        makeObservable(this, {
            blockchain_address: observable,
            container: observable,
            error: observable,
            is_10k_withdrawal_limit_reached: observable,
            is_withdraw_confirmed: observable,
            withdraw_amount: observable,
            max_withdraw_amount: observable,
            crypto_config: observable,
            setIsWithdrawConfirmed: action.bound,
            setWithdrawAmount: action.bound,
            requestWithdraw: action.bound,
            saveWithdraw: action.bound,
            resetWithrawForm: action.bound,
            setBlockchainAddress: action.bound,
            willMountWithdraw: action.bound,
            onMountWithdraw: action.bound,
            onMountCryptoWithdraw: action.bound,
            is_withdrawal_locked: computed,
            setMaxWithdrawAmount: action.bound,
            check10kLimit: action.bound,
            set10kLimitation: action.bound,
            setWithdrawPercentageSelectorResult: action.bound,
            validateWithdrawFromAmount: action.bound,
            validateWithdrawToAmount: action.bound,
            account_platform_icon: computed,
        });

        this.verification = new VerificationStore({ root_store, WS });
        this.root_store = root_store;
        this.WS = WS;
    }

    blockchain_address = '';
    container = Constants.containers.withdraw;
    error = new ErrorStore();
    is_10k_withdrawal_limit_reached = undefined;
    is_withdraw_confirmed = false;
    withdraw_amount = '';
    max_withdraw_amount = 0;
    crypto_config = {};

    setIsWithdrawConfirmed(is_withdraw_confirmed) {
        const { converter_from_amount } = this.root_store.modules.cashier.crypto_fiat_converter;
        this.is_withdraw_confirmed = is_withdraw_confirmed;

        if (is_withdraw_confirmed) this.setWithdrawAmount(converter_from_amount);

        if (!is_withdraw_confirmed && this.verification) {
            this.verification.clearVerification();
        }
    }

    setWithdrawAmount(amount) {
        this.withdraw_amount = amount;
    }

    async requestWithdraw(verification_code) {
        const { client, modules } = this.root_store;
        const { crypto_fiat_converter } = modules.cashier;

        if (!client.is_logged_in) {
            return;
        }

        if (!crypto_fiat_converter.converter_from_amount) {
            crypto_fiat_converter.setConverterFromError(localize('This field is required.'));
            return;
        }

        await this.WS.cryptoWithdraw({
            address: this.blockchain_address,
            amount: +crypto_fiat_converter.converter_from_amount,
            verification_code,
            dry_run: 1,
        }).then(response => {
            if (response.error) {
                this.error.setErrorMessage({ code: 'CryptoWithdrawalError', message: response.error.message });
            } else {
                this.saveWithdraw(verification_code);
            }
        });
    }

    async saveWithdraw(verification_code) {
        const { converter_from_amount } = this.root_store.modules.cashier.crypto_fiat_converter;

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
                    this.verification.clearVerification();
                }
                this.resetWithrawForm();
            } else {
                this.setIsWithdrawConfirmed(true);
            }
        });
    }

    resetWithrawForm() {
        const { setConverterFromAmount, setConverterToAmount } = this.root_store.modules.cashier.crypto_fiat_converter;
        this.setBlockchainAddress('');
        setConverterFromAmount('');
        setConverterToAmount('');
        this.verification.clearVerification();
    }

    setBlockchainAddress(address) {
        this.blockchain_address = address;
    }

    willMountWithdraw(verification_code) {
        if (verification_code) {
            this.verification.clearVerification();
        }
    }

    async onMountWithdraw(verification_code) {
        const { client, modules } = this.root_store;
        const { active_container, is_crypto, onMountCommon, setLoading, setOnRemount } = modules.cashier.general_store;
        const {
            checkIframeLoaded,
            clearTimeoutCashierUrl,
            clearIframe,
            is_session_timeout,
            setContainerHeight,
            setIframeUrl,
            setSessionTimeout,
            setTimeoutCashierUrl,
        } = modules.cashier.iframe;
        const { is_virtual } = client;
        const current_container = active_container;

        setOnRemount(this.onMountWithdraw);
        await onMountCommon();

        this.error.setErrorMessage('');
        setContainerHeight(0);
        clearIframe();
        setLoading(true);

        if (!is_session_timeout) {
            checkIframeLoaded();
            return;
        }

        // if session has timed out reset everything
        setIframeUrl('');
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
            setSessionTimeout(true);
            clearTimeoutCashierUrl();
            if (verification_code) {
                // clear verification code on error
                this.verification.clearVerification();
            }
        } else if (is_crypto) {
            setLoading(false);
        } else {
            await checkIframeLoaded();
            setLoading(false);
            setIframeUrl(response_cashier.cashier);
            setSessionTimeout(false);
            setTimeoutCashierUrl(true);
        }
    }

    async onMountCryptoWithdraw(verification_code) {
        const { crypto_fiat_converter, general_store, iframe } = this.root_store.modules.cashier;

        general_store.setLoading(true);
        const str_reg_exp = /^\w{8,128}$/;
        let response_cashier;

        if (str_reg_exp.test(verification_code)) {
            response_cashier = await this.WS.cryptoWithdraw({
                address: this.blockchain_address,
                amount: +crypto_fiat_converter.converter_from_amount,
                verification_code,
                dry_run: 1,
            });
        } else {
            response_cashier = { error: { code: 'InvalidToken', message: 'Your token has expired or is invalid.' } };
        }

        if (response_cashier.error?.code === 'InvalidToken') {
            this.error.handleCashierError(response_cashier.error);
            general_store.setLoading(false);
            iframe.setSessionTimeout(true);
            iframe.clearTimeoutCashierUrl();
            if (verification_code) {
                // clear verification code on error
                this.verification.clearVerification();
            }
        } else {
            this.crypto_config = (await this.WS.cryptoConfig())?.crypto_config;
            general_store.setLoading(false);
        }
    }

    get is_withdrawal_locked() {
        const { client } = this.root_store;
        const { authentication } = client.account_status;

        if (!client.account_status?.status) return false;
        const need_poi = authentication.needs_verification.includes('identity');
        const need_authentication = this.error.is_ask_authentication && need_poi;

        return client.is_withdrawal_lock || need_authentication || this.error.is_ask_financial_risk_approval;
    }

    setMaxWithdrawAmount(amount) {
        this.max_withdraw_amount = amount;
    }

    async check10kLimit() {
        const { client } = this.root_store;

        const remainder = (await client.getLimits())?.get_limits?.remainder;
        this.setMaxWithdrawAmount(remainder);
        const min_withdrawal = getMinWithdrawal(client.currency);
        const is_limit_reached = !!(typeof remainder !== 'undefined' && +remainder < min_withdrawal);
        this.set10kLimitation(is_limit_reached);
    }

    set10kLimitation(is_limit_reached) {
        this.is_10k_withdrawal_limit_reached = is_limit_reached;
    }

    setWithdrawPercentageSelectorResult(amount) {
        const { client, modules } = this.root_store;
        const { crypto_fiat_converter, general_store } = modules.cashier;
        const { currency, current_fiat_currency } = client;

        if (amount > 0) {
            crypto_fiat_converter.setConverterFromAmount(amount);
            this.validateWithdrawFromAmount();
            crypto_fiat_converter.onChangeConverterFromAmount(
                { target: { value: amount } },
                currency,
                current_fiat_currency || 'USD'
            );
        } else {
            crypto_fiat_converter.resetConverter();
        }
        crypto_fiat_converter.setIsTimerVisible(false);
        general_store.percentageSelectorSelectionStatus(false);
    }

    validateWithdrawFromAmount() {
        let error_message = '';

        const { client, modules } = this.root_store;
        const { balance, currency } = client;
        const { crypto_fiat_converter } = modules.cashier;
        const { converter_from_amount, setConverterFromError } = crypto_fiat_converter;

        const min_withdraw_amount = this.crypto_config?.currencies_config?.[currency]?.minimum_withdrawal;
        const max_withdraw_amount = +this.max_withdraw_amount > +balance ? +balance : +this.max_withdraw_amount;

        const format_balance = formatMoney(currency, balance, true);
        const format_min_withdraw_amount = formatMoney(currency, min_withdraw_amount, true);
        const format_max_withdraw_amount = formatMoney(currency, max_withdraw_amount, true);

        if (converter_from_amount) {
            const { is_ok, message } = validNumber(converter_from_amount, {
                type: 'float',
                decimals: getDecimalPlaces(currency),
            });
            if (!is_ok) error_message = message;
            else if (+balance < +converter_from_amount) error_message = localize('Insufficient funds');
            else if (+balance < +min_withdraw_amount) {
                error_message = localize(
                    'Your balance ({{format_balance}} {{currency}}) is less than the current minimum withdrawal allowed ({{format_min_withdraw_amount}} {{currency}}). Please top up your account to continue with your withdrawal.',
                    { format_balance, currency, format_min_withdraw_amount }
                );
            } else if (+converter_from_amount < +min_withdraw_amount || +converter_from_amount > +max_withdraw_amount) {
                error_message = localize(
                    'The current allowed withdraw amount is {{format_min_withdraw_amount}} to {{format_max_withdraw_amount}} {{currency}}',
                    { format_min_withdraw_amount, format_max_withdraw_amount, currency }
                );
            }

            if (isMobile() && error_message.length > 35) {
                const error_content = error_message;
                error_message = (
                    <ReadMore
                        expand_text={localize('more')}
                        text={error_content}
                        collapse_length={28}
                        openDialog={() =>
                            this.error.setErrorMessage({ code: 'CryptoWithdrawalReadMore', message: error_content })
                        }
                        show_dialog
                    />
                );
            }
        }
        setConverterFromError(error_message);
    }

    validateWithdrawToAmount() {
        let error_message = '';
        const { client, modules } = this.root_store;
        const { current_fiat_currency } = client;
        const { converter_to_amount, setConverterToError } = modules.cashier.crypto_fiat_converter;

        if (converter_to_amount) {
            const { is_ok, message } = validNumber(converter_to_amount, {
                type: 'float',
                decimals: getDecimalPlaces(current_fiat_currency),
            });
            if (!is_ok) error_message = message;
        }

        setConverterToError(error_message);
    }

    get account_platform_icon() {
        const { account_list, loginid } = this.root_store.client;
        const platform_icon = account_list.find(acc => loginid === acc.loginid).icon;

        return platform_icon;
    }
}
