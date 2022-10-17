import { action, computed, observable } from 'mobx';
import {
    formatMoney,
    isEmptyObject,
    isCryptocurrency,
    getCurrencies,
    getCurrencyDisplayCode,
    getDecimalPlaces,
    getCFDAccountDisplay,
    getCFDAccount,
    getPropertyValue,
    validNumber,
    CFD_PLATFORMS,
} from '@deriv/shared';
import { localize } from '@deriv/translations';
import Constants from 'Constants/constants';
import ErrorStore from './error-store';
import AccountTransferGetSelectedError from 'Pages/account-transfer/account-transfer-get-selected-error';
import { TRootStore, TWebSocket, TAccount, TTransferAccount, TTransferBetweensAccounts } from 'Types';

const hasTransferNotAllowedLoginid = (loginid?: string) => loginid?.startsWith('MX');

export default class AccountTransferStore {
    // eslint-disable-next-line no-useless-constructor
    constructor(public WS: TWebSocket, public root_store: TRootStore) {}

    @observable accounts_list: Array<TAccount> = [];
    @observable container = Constants.containers.account_transfer;
    @observable error = new ErrorStore();
    @observable has_no_account = false;
    @observable has_no_accounts_balance = false;
    @observable is_transfer_confirm = false;
    @observable is_transfer_successful = false;
    @observable is_mt5_transfer_in_progress = false;
    @observable minimum_fee = '';
    @observable receipt = {
        amount_transferred: 0,
    };
    @observable selected_from: TAccount = {};
    @observable selected_to: TAccount = {};
    @observable account_transfer_amount = 0;
    @observable transfer_fee: number | undefined | null = null;
    @observable transfer_limit: { min?: string | null; max?: string | null } = {};

    @computed
    get is_account_transfer_visible() {
        const { has_maltainvest_account, landing_company_shortcode, residence } = this.root_store.client;
        // cashier Transfer account tab is hidden for iom clients
        // check for residence to hide the tab before creating a real money account
        return residence !== 'im' && (landing_company_shortcode !== 'malta' || has_maltainvest_account);
    }

    @computed
    get is_transfer_locked() {
        const {
            is_financial_account,
            is_financial_information_incomplete,
            is_trading_experience_incomplete,
            account_status,
        } = this.root_store.client;

        if (!account_status.status) return false;

        const need_financial_assessment =
            is_financial_account && (is_financial_information_incomplete || is_trading_experience_incomplete);

        return need_financial_assessment && this.error.is_ask_financial_risk_approval;
    }

    @action.bound
    setBalanceByLoginId(loginid: string, balance: string | number) {
        const account = this.accounts_list.find(acc => loginid === acc.value);
        if (account) account.balance = balance;
    }

    @action.bound
    setBalanceSelectedFrom(balance: string | number): void {
        this.selected_from.balance = balance;
    }

    @action.bound
    setBalanceSelectedTo(balance: string | number): void {
        this.selected_to.balance = balance;
    }

    // possible transfers:
    // 1. fiat to crypto & vice versa
    // 2. fiat to mt & vice versa
    // 3. crypto to mt & vice versa
    @action.bound
    async onMountAccountTransfer() {
        const { client, modules } = this.root_store;
        const { onMountCommon, setLoading, setOnRemount } = modules.cashier.general_store;
        const { active_accounts, is_logged_in } = client;

        setLoading(true);
        setOnRemount(this.onMountAccountTransfer);
        await onMountCommon();
        await this.WS.wait('website_status');

        // check if some balance update has come in since the last mount
        const has_updated_account_balance =
            this.has_no_accounts_balance &&
            Object.keys(active_accounts).find(
                account => !active_accounts[Number(account)].is_virtual && active_accounts[Number(account)].balance
            );
        if (has_updated_account_balance) {
            this.setHasNoAccountsBalance(false);
        }

        // various issues happen when loading from cache
        // e.g. new account may have been created, transfer may have been done elsewhere, etc
        // so on load of this page just call it again
        if (is_logged_in) {
            const transfer_between_accounts = await this.WS.authorized.transferBetweenAccounts();

            if (transfer_between_accounts.error) {
                this.error.setErrorMessage(transfer_between_accounts.error, this.onMountAccountTransfer);
                setLoading(false);
                return;
            }

            if (!this.canDoAccountTransfer(transfer_between_accounts.accounts)) {
                return;
            }

            await this.sortAccountsTransfer(transfer_between_accounts);
            this.setTransferFee();
            this.setMinimumFee();
            this.setTransferLimit();

            if (this.accounts_list?.length > 0) {
                const cfd_transfer_to_login_id = sessionStorage.getItem('cfd_transfer_to_login_id');
                sessionStorage.removeItem('cfd_transfer_to_login_id');
                const obj_values = this.accounts_list.find(account => account.value === cfd_transfer_to_login_id);
                if (obj_values) {
                    if (hasTransferNotAllowedLoginid(obj_values.value)) {
                        // check if selected to is not allowed account
                        obj_values.error = AccountTransferGetSelectedError(obj_values.value);
                    }
                    this.setSelectedTo(obj_values);
                }
            }
        }
        setLoading(false);
    }

    canDoAccountTransfer(accounts: TTransferBetweensAccounts['accounts']) {
        let can_transfer = true;
        // should have at least one account with balance
        if (!accounts?.find(account => Number(account.balance) > 0)) {
            can_transfer = false;
            this.setHasNoAccountsBalance(true);
        } else {
            this.setHasNoAccountsBalance(false);
        }
        // should have at least two real-money accounts
        if (accounts && accounts.length <= 1) {
            can_transfer = false;
            this.setHasNoAccount(true);
        } else {
            this.setHasNoAccount(false);
        }
        if (!can_transfer) {
            this.root_store.modules.cashier.general_store.setLoading(false);
        }
        return can_transfer;
    }

    @action.bound
    setHasNoAccountsBalance(has_no_accounts_balance: boolean): void {
        this.has_no_accounts_balance = has_no_accounts_balance;
    }

    @action.bound
    setHasNoAccount(has_no_account: boolean): void {
        this.has_no_account = has_no_account;
    }

    @action.bound
    setTransferFee() {
        const transfer_fee = getPropertyValue(getCurrencies(), [
            this.selected_from.currency,
            'transfer_between_accounts',
            'fees',
            this.selected_to.currency,
        ]);
        this.transfer_fee = Number(transfer_fee || 0);
    }

    @action.bound
    setMinimumFee() {
        const decimals = getDecimalPlaces(this.selected_from.currency);
        // we need .toFixed() so that it doesn't display in scientific notation, e.g. 1e-8 for currencies with 8 decimal places
        this.minimum_fee = (1 / Math.pow(10, decimals)).toFixed(decimals);
    }

    @action.bound
    setTransferLimit() {
        const is_mt_transfer = this.selected_from.is_mt || this.selected_to.is_mt;
        const is_dxtrade_transfer = this.selected_from.is_dxtrade || this.selected_to.is_dxtrade;

        let limits_key;
        if (is_mt_transfer) {
            limits_key = 'limits_mt5';
        } else if (is_dxtrade_transfer) {
            limits_key = 'limits_dxtrade';
        } else {
            limits_key = 'limits';
        }

        const transfer_limit = getPropertyValue(getCurrencies(), [
            this.selected_from.currency,
            'transfer_between_accounts',
            limits_key,
        ]);
        const balance = this.selected_from.balance;
        const decimal_places = getDecimalPlaces(this.selected_from.currency);
        const has_max_transfer_limit =
            !transfer_limit?.max ||
            (balance && +balance >= (transfer_limit?.min || 0) && (balance && +balance) <= transfer_limit?.max);
        // we need .toFixed() so that it doesn't display in scientific notation, e.g. 1e-8 for currencies with 8 decimal places
        this.transfer_limit = {
            max: has_max_transfer_limit ? balance : transfer_limit?.max.toFixed(decimal_places),
            min: transfer_limit?.min ? (+transfer_limit?.min).toFixed(decimal_places) : null,
        };
    }

    @action.bound
    async sortAccountsTransfer(response_accounts?: TTransferBetweensAccounts) {
        const transfer_between_accounts = response_accounts || (await this.WS.authorized.transferBetweenAccounts());
        if (!this.accounts_list.length) {
            if (transfer_between_accounts.error) {
                return;
            }
        }

        const mt5_login_list = (await this.WS.storage.mt5LoginList())?.mt5_login_list;
        // TODO: move `tradingPlatformAccountsList` to deriv-api to use storage
        const dxtrade_accounts_list = (await this.WS.tradingPlatformAccountsList(CFD_PLATFORMS.DXTRADE))
            ?.trading_platform_accounts;

        // TODO: remove this temporary mapping when API adds market_type and sub_account_type to transfer_between_accounts
        const accounts = transfer_between_accounts.accounts?.map(account => {
            if (account.account_type === CFD_PLATFORMS.MT5 && Array.isArray(mt5_login_list) && mt5_login_list.length) {
                // account_type in transfer_between_accounts (mt5|binary)
                // gets overridden by account_type in mt5_login_list (demo|real)
                // since in cashier all these are real accounts, the mt5 account type is what we want to keep
                const found_account = mt5_login_list.find(acc => acc.login === account.loginid);

                if (found_account === undefined) return account;

                return { ...account, ...found_account, account_type: CFD_PLATFORMS.MT5 };
            }
            if (
                account.account_type === CFD_PLATFORMS.DXTRADE &&
                Array.isArray(dxtrade_accounts_list) &&
                dxtrade_accounts_list.length
            ) {
                // account_type in transfer_between_accounts (mt5|binary)
                // gets overridden by account_type in dxtrade_accounts_list (demo|real)
                // since in cashier all these are real accounts, the mt5 account type is what we want to keep
                const found_account = dxtrade_accounts_list.find(acc => acc.account_id === account.loginid);

                if (found_account === undefined) return account;

                return { ...account, ...found_account, account_type: CFD_PLATFORMS.DXTRADE };
            }
            return account;
        });
        // sort accounts as follows:
        // for MT5, synthetic, financial, financial stp
        // for non-MT5, fiat, crypto (alphabetically by currency)
        // should have more than one account
        if (transfer_between_accounts.accounts && transfer_between_accounts.accounts.length > 1) {
            accounts?.sort((a, b) => {
                const a_is_mt = a.account_type === CFD_PLATFORMS.MT5;
                const b_is_mt = b.account_type === CFD_PLATFORMS.MT5;
                const a_currency = a.currency ? a.currency : '';
                const b_currency = b.currency ? b.currency : '';
                const a_is_crypto = !a_is_mt && isCryptocurrency(a.currency);
                const b_is_crypto = !b_is_mt && isCryptocurrency(b.currency);
                const a_is_fiat = !a_is_mt && !a_is_crypto;
                const b_is_fiat = !b_is_mt && !b_is_crypto;
                if (a_is_mt && b_is_mt) {
                    if (a.market_type === 'synthetic') {
                        return -1;
                    }
                    if ('sub_account_type' in a && a.sub_account_type === 'financial') {
                        return b.market_type === 'synthetic' ? 1 : -1;
                    }
                    return 1;
                } else if ((a_is_crypto && b_is_crypto) || (a_is_fiat && b_is_fiat)) {
                    return a_currency < b_currency ? -1 : 1;
                } else if ((a_is_crypto && b_is_mt) || (a_is_fiat && b_is_crypto) || (a_is_fiat && b_is_mt)) {
                    return -1;
                }
                return a_is_mt ? -1 : 1;
            });
        }
        const arr_accounts: Array<TTransferAccount | TAccount> = [];
        this.setSelectedTo({}); // set selected to empty each time so we can redetermine its value on reload

        accounts?.forEach((acc: any) => {
            const account = acc as TTransferAccount;
            const cfd_platforms = {
                mt5: { name: 'DMT5', icon: 'IcMt5' },
                dxtrade: { name: 'Deriv X', icon: 'IcDxtrade' },
            };
            const is_cfd = Object.keys(cfd_platforms).includes(account.account_type!);
            const cfd_text_display = cfd_platforms[account.account_type as keyof typeof cfd_platforms]?.name;
            const cfd_icon_display = `${
                cfd_platforms[account.account_type as keyof typeof cfd_platforms]?.icon
            }-${getCFDAccount({
                market_type: account.market_type,
                sub_account_type: account.sub_account_type,
                platform: account.account_type,
                is_eu: this.root_store.client.is_eu,
            })}`;
            const non_eu_accounts =
                account.landing_company_short &&
                account.landing_company_short !== 'svg' &&
                account.landing_company_short !== 'bvi'
                    ? account.landing_company_short?.charAt(0).toUpperCase() + account.landing_company_short?.slice(1)
                    : account.landing_company_short?.toUpperCase();

            const cfd_account_text_display =
                account.account_type === 'mt5'
                    ? `${getCFDAccountDisplay({
                          market_type: account.market_type,
                          sub_account_type: account.sub_account_type,
                          platform: account.account_type,
                          is_eu: this.root_store.client.is_eu,
                      })} ${this.root_store.client.is_eu ? '' : non_eu_accounts}`
                    : `${cfd_text_display} ${getCFDAccountDisplay({
                          market_type: account.market_type,
                          sub_account_type: account.sub_account_type,
                          platform: account.account_type,
                          is_eu: this.root_store.client.is_eu,
                      })}`;
            const account_text_display = is_cfd
                ? cfd_account_text_display
                : getCurrencyDisplayCode(
                      account.currency !== 'eUSDT' ? account.currency?.toUpperCase() : account.currency
                  );

            const obj_values: TAccount = {
                text: account_text_display,
                value: account.loginid,
                balance: account.balance,
                currency: account.currency,
                is_crypto: isCryptocurrency(account.currency),
                is_mt: account.account_type === CFD_PLATFORMS.MT5,
                is_dxtrade: account.account_type === CFD_PLATFORMS.DXTRADE,
                ...(is_cfd && {
                    platform_icon: cfd_icon_display,
                    status: account?.status,
                    market_type: getCFDAccount({
                        market_type: account.market_type,
                        sub_account_type: account.sub_account_type,
                        platform: account.account_type,
                        is_eu: this.root_store.client.is_eu,
                    }),
                }),
            };
            // set current logged in client as the default transfer from account
            if (account.loginid === this.root_store.client.loginid) {
                // check if selected from is not allowed account
                if (hasTransferNotAllowedLoginid(obj_values.value)) {
                    obj_values.error = AccountTransferGetSelectedError(obj_values.value, true);
                }

                this.setSelectedFrom(obj_values);
            } else if (isEmptyObject(this.selected_to)) {
                if (hasTransferNotAllowedLoginid(obj_values.value)) {
                    // check if selected to is not allowed account
                    obj_values.error = AccountTransferGetSelectedError(obj_values.value);
                }
                // set the first available account as the default transfer to account
                this.setSelectedTo(obj_values);
            }
            arr_accounts.push(obj_values);
        });
        this.setAccounts(arr_accounts);
    }

    @action.bound
    setSelectedFrom(obj_values: TAccount): void {
        this.selected_from = obj_values;
    }

    @action.bound
    setSelectedTo(obj_values: TAccount): void {
        this.selected_to = obj_values;
    }

    @action.bound
    setAccounts(arr_accounts: Array<TAccount>): void {
        this.accounts_list = arr_accounts;
    }

    @action.bound
    setIsTransferConfirm(is_transfer_confirm: boolean): void {
        this.is_transfer_confirm = is_transfer_confirm;
    }

    @action.bound
    setAccountTransferAmount(amount: number): void {
        this.account_transfer_amount = amount;
    }

    @action.bound
    setIsTransferSuccessful(is_transfer_successful: boolean): void {
        this.is_transfer_successful = is_transfer_successful;
    }

    @action.bound
    setIsMT5TransferInProgress(is_mt5_transfer_in_progress: boolean): void {
        this.is_mt5_transfer_in_progress = is_mt5_transfer_in_progress;
    }

    @action.bound
    setReceiptTransfer({ amount }: { amount: number }): void {
        this.receipt = {
            amount_transferred: amount,
        };
    }

    @action.bound
    onChangeTransferFrom({ target }: { target: { value: string } }) {
        this.error.setErrorMessage({ message: '', code: '' });
        this.selected_from.error = '';

        const accounts = this.accounts_list;
        const selected_from = accounts.find(account => account.value === target.value);

        // if new value of selected_from is the same as the current selected_to
        // switch the value of selected_from and selected_to
        if (selected_from?.value === this.selected_to.value) {
            this.onChangeTransferTo({ target: { value: this.selected_from.value } });
        } else if (
            (selected_from?.is_mt && this.selected_to.is_mt) ||
            (selected_from?.is_dxtrade && this.selected_to.is_dxtrade) ||
            (selected_from?.is_dxtrade && this.selected_to.is_mt) ||
            (selected_from?.is_mt && this.selected_to.is_dxtrade)
        ) {
            // not allowed to transfer from MT to MT
            // not allowed to transfer from Dxtrade to Dxtrade
            // not allowed to transfer between MT and Dxtrade
            const first_non_cfd = this.accounts_list.find(account => !account.is_mt && !account.is_dxtrade);
            this.onChangeTransferTo({ target: { value: first_non_cfd?.value } });
        }

        if (selected_from && hasTransferNotAllowedLoginid(selected_from?.value)) {
            selected_from.error = AccountTransferGetSelectedError(selected_from?.value, true);
        }

        this.selected_from = selected_from || {};
        this.setTransferFee();
        this.setMinimumFee();
        this.setTransferLimit();
    }

    @action.bound
    onChangeTransferTo({ target }: { target: { value: string | undefined } }) {
        this.error.setErrorMessage({ message: '', code: '' });
        this.selected_to.error = '';

        const accounts = this.accounts_list;
        this.selected_to = accounts.find(account => account.value === target.value) || {};
        if (hasTransferNotAllowedLoginid(this.selected_to.value)) {
            this.selected_to.error = AccountTransferGetSelectedError(this.selected_to.value);
        }
        this.setTransferFee();
        this.setMinimumFee();
        this.setTransferLimit();
    }

    requestTransferBetweenAccounts = async ({ amount }: { amount: number }) => {
        const { client, modules } = this.root_store;
        const { setLoading } = modules.cashier.general_store;
        const {
            is_logged_in,
            responseMt5LoginList,
            responseTradingPlatformAccountsList,
            setAccountStatus,
            setBalanceOtherAccounts,
        } = client;

        if (!is_logged_in) {
            return null;
        }

        setLoading(true);
        this.error.setErrorMessage({ message: '', code: '' });

        const is_mt_transfer = this.selected_from.is_mt || this.selected_to.is_mt;

        if (is_mt_transfer) this.setIsMT5TransferInProgress(true);

        const currency = this.selected_from.currency;
        const transfer_between_accounts = await this.WS.authorized.transferBetweenAccounts(
            this.selected_from.value,
            this.selected_to.value,
            currency,
            amount
        );

        if (is_mt_transfer) this.setIsMT5TransferInProgress(false);

        if (transfer_between_accounts.error) {
            // if there is fiat2crypto transfer limit error, we need to refresh the account_status for authentication
            if (transfer_between_accounts.error.code === 'Fiat2CryptoTransferOverLimit') {
                const account_status_response = await this.WS.authorized.getAccountStatus();
                if (!account_status_response.error) {
                    setAccountStatus(account_status_response.get_account_status);
                }
            }
            this.error.setErrorMessage(transfer_between_accounts.error);
        } else {
            this.setReceiptTransfer({ amount: Number(formatMoney(currency, amount, true)) });
            transfer_between_accounts.accounts?.forEach((account: TTransferAccount) => {
                if (account.loginid && account.balance) {
                    this.setBalanceByLoginId(account.loginid, account.balance);
                }
                if (account.loginid === this.selected_from.value && account.balance) {
                    this.setBalanceSelectedFrom(account.balance);
                } else if (account.loginid === this.selected_to.value && account.balance) {
                    this.setBalanceSelectedTo(account.balance);
                }
                // if one of the accounts was mt5
                if (account.account_type === CFD_PLATFORMS.MT5) {
                    Promise.all([this.WS.mt5LoginList(), this.WS.balanceAll()]).then(
                        ([mt5_login_list_response, balance_response]) => {
                            // update the balance for account switcher by renewing the mt5_login_list response
                            responseMt5LoginList(mt5_login_list_response);
                            // update total balance since MT5 total only comes in non-stream balance call
                            setBalanceOtherAccounts(balance_response.balance);
                        }
                    );
                }
                // if one of the accounts was dxtrade
                if (account.account_type === CFD_PLATFORMS.DXTRADE) {
                    Promise.all([
                        this.WS.tradingPlatformAccountsList(CFD_PLATFORMS.DXTRADE),
                        this.WS.balanceAll(),
                    ]).then(([dxtrade_login_list_response, balance_response]) => {
                        // update the balance for account switcher by renewing the dxtrade_login_list_response
                        responseTradingPlatformAccountsList(dxtrade_login_list_response);
                        // update total balance since Dxtrade total only comes in non-stream balance call
                        setBalanceOtherAccounts(balance_response.balance);
                    });
                }
            });
            this.setAccountTransferAmount(0);
            this.setIsTransferConfirm(true);
        }
        setLoading(false);
        return transfer_between_accounts;
    };

    @action.bound
    resetAccountTransfer = async () => {
        this.setIsTransferConfirm(false);
        this.setTransferLimit();
    };

    @action.bound
    setTransferPercentageSelectorResult(amount: number) {
        const { crypto_fiat_converter, general_store } = this.root_store.modules.cashier;

        const selected_from_currency = this.selected_from.currency;
        const selected_to_currency = this.selected_to.currency;

        if (amount > 0 || Number(this.selected_from.balance) === 0) {
            crypto_fiat_converter.setConverterFromAmount(amount);
            this.validateTransferFromAmount();
            crypto_fiat_converter.onChangeConverterFromAmount(
                { target: { value: amount } },
                selected_from_currency,
                selected_to_currency
            );
        } else {
            crypto_fiat_converter.resetConverter();
        }
        crypto_fiat_converter.setIsTimerVisible(false);
        general_store.percentageSelectorSelectionStatus(false);
    }

    @action.bound
    validateTransferFromAmount() {
        const { converter_from_amount, setConverterFromError } = this.root_store.modules.cashier.crypto_fiat_converter;

        if (!converter_from_amount) {
            setConverterFromError(localize('This field is required.'));
        } else {
            const { is_ok, message } = validNumber(converter_from_amount, {
                type: 'float',
                decimals: getDecimalPlaces(this.selected_from.currency),
                min: this.transfer_limit.min,
                max: this.transfer_limit.max,
            });
            if (!is_ok) {
                setConverterFromError(message);
            } else if (Number(this.selected_from.balance) < +converter_from_amount) {
                setConverterFromError(localize('Insufficient funds'));
            } else {
                setConverterFromError('');
            }
        }
    }

    @action.bound
    validateTransferToAmount() {
        const { converter_to_amount, setConverterToError } = this.root_store.modules.cashier.crypto_fiat_converter;

        if (converter_to_amount) {
            const currency = this.selected_to.currency;
            const { is_ok, message } = validNumber(converter_to_amount, {
                type: 'float',
                decimals: getDecimalPlaces(currency),
            });
            if (!is_ok) {
                setConverterToError(message);
            } else {
                setConverterToError('');
            }
        }
    }
}
