import {
    action,
    computed,
    observable,
    runInAction }         from 'mobx';
import { WS }             from 'Services/ws-methods';
import BaseStore          from 'Stores/base-store';
import {
    getMt5GroupConfig,
    getAccountTypeFields,
    getMtCompanies }      from './Helpers/mt5-config';

export default class MT5Store extends BaseStore {
    @observable is_compare_accounts_visible = false;
    @observable account_type                = {
        category: undefined,
        type    : undefined,
    };

    @observable new_account_response = {};
    @observable map_type             = {};
    @observable has_mt5_error        = false;
    @observable error_message        = '';

    @observable is_mt5_success_dialog_enabled = false;
    @observable is_mt5_password_modal_enabled = false;

    @observable current_account = undefined; // this is a tmp value, don't rely on it, unless you set it first.

    constructor({ root_store }) {
        super({ root_store });
    }

    @computed
    get has_mt5_account() {
        return this.current_list.length > 0;
    }

    @computed
    get account_title() {
        return this.account_type.category
            ? getMtCompanies()[this.account_type.category][this.account_type.type].title
            : '';
    }

    @computed
    get current_list() {
        const list = [];

        this.root_store.client.mt5_login_list.forEach(login => {
            const { type, category }    = getMt5GroupConfig(login.group);
            list[`${category}.${type}`] = Object.assign({}, login);
        });

        return list;
    }

    // eslint-disable-next-line class-methods-use-this
    get mt5_companies() {
        return getMtCompanies();
    }

    @action.bound
    onMount() {
        this.onRealAccountSignupEnd(this.realAccountSignupEndListener);
    }

    @action.bound
    onUnmount() {
        this.disposeRealAccountSignupEnd();
    }

    @action.bound
    realAccountSignupEndListener() {
        const post_signup = JSON.parse(sessionStorage.getItem('post_real_account_signup'));
        if (post_signup && post_signup.category && post_signup.type) {
            sessionStorage.removeItem('post_real_account_signup');
            this.enableMt5PasswordModal();
        }
        return Promise.resolve();
    }

    @action.bound
    clearMt5Error() {
        this.error_message                 = '';
        this.has_mt5_error                 = false;
        this.is_mt5_password_modal_enabled = false;
    }

    @action.bound
    async closeMt5AndOpenCashier(active_tab = 'deposit') {
        this.root_store.ui.setCashierActiveTab(active_tab);
        setTimeout(this.root_store.ui.toggleCashierModal, 300);
        // We should switch the user to the first svg account in order for cashier to work
        runInAction(() => {
            this.is_mt5_password_modal_enabled = false;
        });
    }

    @action.bound
    createMT5Account({ category, type }) {
        this.setAccountType({
            category,
            type,
        });

        if (category === 'real') {
            this.realMt5Signup();
        } else {
            this.demoMt5Signup();
        }
    }

    demoMt5Signup() {
        this.enableMt5PasswordModal();
    }

    @action.bound
    disableMt5PasswordModal() {
        this.is_mt5_password_modal_enabled = false;
    }

    @action.bound
    enableMt5PasswordModal() {
        this.is_mt5_password_modal_enabled = true;
    }

    @action.bound
    getLoginDetails({ category, type }) {
        let tmp_type = '';
        switch (type) {
            case 'synthetic_indices':
                tmp_type = 'svg';
                break;
            case 'standard':
                tmp_type = 'svg_standard';
                break;
            default:
                tmp_type = 'labuan_advanced';
        }
        const group = `${category}\\${tmp_type}`;

        return this.current_list.filter(item => item.group === group);
    }

    @action.bound
    getName() {
        const { first_name } = (this.root_store.client.account_settings && this.root_store.client.account_settings);
        const title = this.mt5_companies[this.account_type.category][this.account_type.type].title;

        // First name is not set when user has no real account
        return first_name ? [ first_name, title ].join(' ') : title;
    }

    @action.bound
    openAccount(mt5_password) {
        const name         = this.getName();
        const leverage     = this.mt5_companies[this.account_type.category][this.account_type.type].leverage;
        const type_request = getAccountTypeFields(this.account_type);

        return WS.mt5NewAccount({
            mainPassword: mt5_password,
            email       : this.root_store.client.email_address,
            leverage,
            name,
            ...type_request,
        });
    }

    @action.bound
    beginRealSignupForMt5() {
        sessionStorage.setItem('post_real_account_signup', JSON.stringify(this.account_type));
        this.root_store.ui.is_real_acc_signup_on = true;
    }

    realMt5Signup() {
        // Check if the user has real account
        if (!this.root_store.client.has_active_real_account
            || !this.root_store.client.currency
        ) {
            this.beginRealSignupForMt5();
        } else {
            switch (this.account_type.type) {
                case 'standard':
                    this.enableMt5PasswordModal();
                    break;
                case 'advanced':
                    // eslint-disable-next-line no-console
                    console.log('Open Real advanced account for user');
                    break;
                case 'synthetic_indices':
                    // eslint-disable-next-line no-console
                    this.enableMt5PasswordModal();
                    break;
                default:
                    throw new Error('Cannot determine mt5 account signup.');
            }
        }
    }

    @action.bound
    setAccountType(account_type) {
        this.account_type = account_type;
    }

    @action.bound
    setCurrentAccount(data, meta) {
        this.current_account = {
            ...meta,
            ...data,
        };
    }

    @action.bound
    setError(state, obj) {
        this.has_mt5_error = state;
        this.error_message = obj ? obj.message : '';
    }

    @action.bound
    setMt5Account(mt5_new_account) {
        this.new_account_response = mt5_new_account;
    }

    @action.bound
    setMt5SuccessDialog(value) {
        this.is_mt5_success_dialog_enabled = !!value;
    }

    @action.bound
    async submitMt5Password(mt5_password, setSubmitting) {
        const response = await this.openAccount(mt5_password);
        if (!response.error) {
            WS.authorized.storage.mt5LoginList().then(this.root_store.client.responseMt5LoginList);
            runInAction(() => {
                this.setMt5Account(response.mt5_new_account);
                this.root_store.ui.is_mt5_password_modal_enabled = false;
                this.has_mt5_error                               = false;
                setTimeout(() => this.setMt5SuccessDialog(true), 300);
            });
        } else {
            this.setError(true, response.error);
            // eslint-disable-next-line no-console
            console.warn('API Error: ', response);
        }
        setSubmitting(false);
    }

    @action.bound
    toggleCompareAccountsModal() {
        this.is_compare_accounts_visible = !this.is_compare_accounts_visible;
    }

    @action.bound
    async topUpVirtual() {
        const response = await WS.authorized.mt5Deposit({
            to_mt5: this.current_account.login,
        });
        if (!response.error) {
            WS.authorized.mt5LoginList().then(this.root_store.client.responseMt5LoginList);
            runInAction(() => {
                // Get new current account
                this.root_store.ui.is_top_up_virtual_open = false;
                this.current_account.balance += 10000;
            });
            setTimeout(() => {
                runInAction(() => {
                    this.root_store.ui.is_top_up_virtual_success = true;
                });
            }, 250);
        } else {
            // eslint-disable-next-line no-console
            console.error(response);
        }
    }

    static async changePassword({ login, old_password, new_password, password_type }) {
        const response = await WS.authorized.mt5PasswordChange(login, old_password, new_password, password_type);

        if (response.error) {
            return response.error.message;
        }

        return undefined;
    }
}
