import { observable, action, makeObservable } from 'mobx';
import { isCryptocurrency } from '@deriv/shared';

export default class AccountPromptDialogStore {
    constructor(root_store) {
        makeObservable(this, {
            should_show: observable,
            is_confirmed: observable,
            last_location: observable,
            current_location: observable,
            shouldNavigateAfterPrompt: action.bound,
            resetLastLocation: action.bound,
            resetIsConfirmed: action.bound,
            onConfirm: action.bound,
            onCancel: action.bound,
            continueRoute: action.bound,
        });

        this.root_store = root_store;
    }

    should_show = false;
    is_confirmed = false;
    last_location = null;
    current_location = null;

    shouldNavigateAfterPrompt(next_location, current_location) {
        if (!this.is_confirmed) {
            this.last_location = next_location;
            this.should_show = true;
            this.current_location = current_location;
        }
    }

    resetLastLocation() {
        this.last_location = null;
    }

    resetIsConfirmed() {
        this.is_confirmed = false;
    }

    async onConfirm() {
        const { client, modules } = this.root_store;
        const { accounts_list } = modules.cashier.account_transfer;

        this.should_show = false;
        this.is_confirmed = true;

        const has_fiat_account = accounts_list.some(x => !x.is_crypto);
        if (isCryptocurrency(client?.currency) && has_fiat_account) await this.doSwitch();
    }

    async doSwitch() {
        const { client, modules } = this.root_store;
        const { account_transfer, general_store } = modules.cashier;

        const non_crypto_accounts = account_transfer.accounts_list.filter(x => !x.is_crypto);
        const loginid = non_crypto_accounts.map(x => x.value)[0];
        await client.switchAccount(loginid);

        if (this.current_location === 'deposit') {
            general_store.setIsDeposit(true);
        }
    }

    onCancel() {
        this.should_show = false;
    }

    continueRoute() {
        if (this.is_confirmed && this.last_location) {
            this.root_store.common.routeTo(this.last_location);
        }
    }
}
