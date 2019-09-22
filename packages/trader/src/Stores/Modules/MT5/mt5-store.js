import {
    action,
    computed,
    observable,
}                from 'mobx';
import BaseStore from '../../base-store';

export default class MT5Store extends BaseStore {
    @observable is_compare_accounts_visible = false;
    @observable accounts_list               = [];
    @observable account_type                = '';

    constructor({ root_store }) {
        super({ root_store });

        this.onSwitchAccount(this.accountSwitcherListener);
    }

    @computed
    get account_title() {
        return this.account_type.replace('_', ' ');
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
    createMT5Account(account_type) {
        const category = account_type.split('_')[0];
        this.setAccountType(account_type);

        switch (category) {
            case 'demo':
                this.demoPreconditions()
                    .then(() => {
                        this.openPasswordModal();
                    });
                break;
            case 'real':
                this.realMt5Signup(account_type);
                break;
            default:
                break;
        }

        if (this.root_store.client.has_real_account) {
            // Real account can open mt5 real standard, real advanced.
        }
        // eslint-disable-next-line no-console
        console.log(account_type, this.root_store.client.accounts);
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

    realMt5Signup(account_type) {
        // Check if the user has real account
        if (!this.root_store.client.has_real_account) {
            // eslint-disable-next-line no-console
            console.log('Redirect user to real account signup form');
        } else {
            const type = account_type.replace('real_', '');
            switch (type) {
                case 'standard':
                    this.root_store.ui.enableMt5PasswordModal();
                    // eslint-disable-next-line no-console
                    console.log('Open Real standard account for user');
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
    setAccountType(account_type) {
        this.account_type = account_type;
    }
}
