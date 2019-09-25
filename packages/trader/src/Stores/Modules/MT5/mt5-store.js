import {
    action,
    observable } from 'mobx';
import BaseStore  from '../../base-store';

export default class MT5Store extends BaseStore {
    @observable is_compare_accounts_visible = false;
    @observable accounts_list = [];

    constructor({ root_store }) {
        super({ root_store });

        this.onSwitchAccount(this.accountSwitcherListener);
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
        // eslint-disable-next-line no-console
        console.log(account_type, this.accounts_list);
    }

    onAccountSwitch() {
        // Handle account type change
        // eslint-disable-next-line no-console
        console.log('MT5 Accounts:', this.accounts_list);
    }

    accountSwitcherListener() {
        return new Promise(async (resolve) => resolve(this.onAccountSwitch()));
    }
}
