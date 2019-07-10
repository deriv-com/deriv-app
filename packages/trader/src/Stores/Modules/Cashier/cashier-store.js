import {
    action,
    observable }    from 'mobx';
import BinarySocket from '_common/base/socket_base';
import BaseStore    from '../../base-store';

export default class CashierStore extends BaseStore {
    @observable deposit_url = '';

    @action.bound
    async onMount() {
        // TODO: investigate: set timeout to clear deposit in case session expires after switch/idle?
        if (this.deposit_url) {
            return;
        }
        // else
        const response_cashier = await BinarySocket.send({ cashier: 'deposit' });

        // TODO: error handling

        this.setDepositUrl(response_cashier.cashier);
    }

    @action.bound
    setDepositUrl(url) {
        this.deposit_url = url;
    }

    // @action.bound
    // onUnmount() {
    //     this.setDepositUrl(null);
    // }
}
