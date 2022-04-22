import { action, observable } from 'mobx';
import { WS } from '@deriv/shared';
import BaseStore from './base-store';

export default class WalletStore extends BaseStore {
    @observable
    wallet_names = {};

    @action.bound
    setWalletNames(data: any) {
        this.wallet_names = data;
    }

    @action.bound
    getWalletNames() {
        WS.authorized.storage
            .send({
                get_account_types: 1,
            })
            .then((response: any) => {
                this.setWalletNames(response.get_account_types.wallet);
            });
    }
}
