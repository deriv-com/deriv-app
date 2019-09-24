import {
    action,
    computed,
    observable,
}                         from 'mobx';
import { WS }             from 'Services';
import {
    getMtCompanies,
    getAccountTypeEnum,
} from './Helpers/metatrader-config';
import BaseStore          from '../../base-store';

export default class MT5Store extends BaseStore {
    @observable is_compare_accounts_visible = false;
    @observable accounts_list               = [];
    @observable account_type                = {
        category: undefined,
        type    : undefined,
    };

    @observable map_type = {

    }

    constructor({ root_store }) {
        super({ root_store });

        this.onSwitchAccount(this.accountSwitcherListener);
    }

    @computed
    get account_title() {
        return this.account_type.category ? getMtCompanies()[this.account_type.category][this.account_type.type].title : '';
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

        switch (category) {
            case 'demo':
                this.demoPreconditions()
                    .then(() => {
                        this.openPasswordModal();
                    });
                break;
            case 'real':
                this.realMt5Signup(type);
                break;
            default:
                break;
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

    demoPreconditions = () => {
        return new Promise((resolve) => resolve('Ready to make'));
    };

    openPasswordModal = () => {
        // eslint-disable-next-line no-console
        console.log('Open password modal...');
    };

    get mt5_companies() {
        return getMtCompanies();
    }

    realMt5Signup(type) {
        // Check if the user has real account
        if (!this.root_store.client.has_real_account) {
            // TODO: Set a sessionStorage/or alike flag to redirect user after
            // Real account Signup to password modal.

            // eslint-disable-next-line no-console
            console.log('Redirect user to real account signup form');
        } else {
            switch (type) {
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
    submitMt5Password(mt5_password, setSubmitting) {
        // TODO:
        //  1. Get current account type from this.account_type using utility [✓]
        //  2. Generate Fullname using first_name+"MT5"+account_type [✓]
        //  3. Get leverage from configuration based on this.account_type using utility function
        //  4. Send API request
        //  5. Find out what to do with the response based on design

        // "required" : [
        //       "mt5_new_account",
        //       "mainPassword",
        //       "name",
        //       "account_type",
        //       "email",
        //       "leverage"
        //    ]
        // TODO fetch from form.
        const name     = this.getName();
        const leverage = this.mt5_companies[this.account_type.category][this.account_type.type].leverage;

        WS.mt5NewAccount({
            mainPassword: mt5_password,
            account_type: getAccountTypeEnum(this.account_type),
            email       : this.root_store.client.email_address,
            leverage,
            name,
        });
        setSubmitting(false);
    }

    @action.bound
    getName() {
        return [
            this.root_store.client.account_settings.first_name,
            'mt',
            this.account_type.type,
        ].join('-');
    }
}
