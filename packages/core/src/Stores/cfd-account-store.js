import { CFD_PLATFORMS, getAccountListKey } from '@deriv/shared';
import BaseStore from './base-store';
import { computed } from 'mobx';

export default class CFDAccountStore extends BaseStore {
    constructor(root_store) {
        super();
        this.root_store = root_store;
    }

    @computed
    get current_list() {
        const list = {};

        this.root_store.client.mt5_login_list.forEach(account => {
            // e.g. mt5.real.financial
            list[getAccountListKey(account, CFD_PLATFORMS.MT5, account.landing_company_short)] = {
                ...account,
            };
        });

        this.root_store.client.dxtrade_accounts_list.forEach(account => {
            // e.g. dxtrade.real.financial
            list[getAccountListKey(account, CFD_PLATFORMS.DXTRADE)] = {
                ...account,
            };
        });

        return list;
    }
}
