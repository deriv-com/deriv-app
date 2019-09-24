import {
    action,
    computed,
    observable,
}                           from 'mobx';
import { WS }               from 'Services';
import {
    getAccountTypeFields,
    getMtCompanies,
}                           from './Helpers/metatrader-config';
import BaseStore            from '../../base-store';

export default class MT5Store extends BaseStore {
    @observable is_compare_accounts_visible = false;
    @observable accounts_list               = [];
    @observable account_type                = {
        category: undefined,
        type    : undefined,
    };

    @observable new_account_response = {};
    @observable map_type             = {};
    @observable has_mt5_error        = false;
    @observable error_message        = '';

    constructor({ root_store }) {
        super({ root_store });

        this.onSwitchAccount(this.accountSwitcherListener);
    }

    @computed
    get account_title() {
        return this.account_type.category
            ? getMtCompanies()[this.account_type.category][this.account_type.type].title
            : '';
    }

    get mt5_companies() {
        return getMtCompanies();
    }

    @action.bound
    setAccountsList(new_list) {
        this.accounts_list = new_list;
    }

    @action.bound
    toggleCompareAccountsModal() {
        this.is_compare_accounts_visible = !this.is_compare_accounts_visible;
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

    @action.bound
    setAccountType(account_type) {
        this.account_type = account_type;
    }

    onAccountSwitch() {
        // Handle account type change
        // eslint-disable-next-line no-console
        console.log('MT5 Accounts:', this.accounts_list);
    }

    accountSwitcherListener() {
        return new Promise(async (resolve) => resolve(this.onAccountSwitch()));
    }

    demoMt5Signup() {
        this.root_store.ui.enableMt5PasswordModal();
    }

    realMt5Signup() {
        // Check if the user has real account
        if (!this.root_store.client.has_real_account) {
            // TODO: Set a sessionStorage/or alike flag to redirect user after
            // Real account Signup to password modal.

            // eslint-disable-next-line no-console
            console.log('Redirect user to real account signup form');
        } else {
            switch (this.account_type.type) {
                case 'standard':
                    this.root_store.ui.enableMt5PasswordModal();
                    break;
                case 'advanced':
                    // eslint-disable-next-line no-console
                    console.log('Open Real advanced account for user');
                    break;
                case 'synthetic_indices':
                    // eslint-disable-next-line no-console
                    console.log('Open Real synthetic indices for the user');
                    break;
                default:
                    throw new Error('Cannot determine mt5 account signup.');
            }
        }
    }

    @action.bound
    setError(state, obj) {
        this.has_mt5_error = state;
        this.error_message = obj ? obj.message : '';
    }

    @action.bound
    async submitMt5Password(mt5_password, setSubmitting) {
        const response = await this.openAccount(mt5_password);
        if (!response.error) {
            this.setMt5Account(response.mt5_new_account);
            this.root_store.ui.is_mt5_success_dialog_enabled = true;
        } else {
            this.setError(true, response.error);
            // eslint-disable-next-line no-console
            console.warn('API Error: ', response);
        }
        setSubmitting(false);
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
    getName() {
        const title = this.mt5_companies[this.account_type.category][this.account_type.type].title;

        return [
            this.root_store.client.account_settings.first_name,
            title,
        ].join(' ');
    }

    @action.bound
    setMt5Account(mt5_new_account) {
        this.new_account_response = mt5_new_account;
    }
}
