import { observable, action } from 'mobx';
import { isCryptocurrency } from '@deriv/shared';

export default class AccountPromptDialogStore {
    constructor(root_store) {
        this.root_store = root_store;
    }

    @observable should_show = false;
    @observable is_confirmed = false;
    @observable last_location = null;
    @observable current_location = null;

    @action.bound
    shouldNavigateAfterPrompt(next_location, current_location) {
        if (!this.is_confirmed) {
            this.last_location = next_location;
            this.should_show = true;
            this.current_location = current_location;
        }
    }

    @action.bound
    resetLastLocation() {
        this.last_location = null;
    }

    @action.bound
    resetIsConfirmed() {
        this.is_confirmed = false;
    }

    @action.bound
    async onConfirm() {
        const { client } = this.root_store;

        this.should_show = false;
        this.is_confirmed = true;

        const has_fiat_account = Object.values(client.accounts).some(
            acc_settings => !acc_settings.is_virtual && !isCryptocurrency(acc_settings.currency)
        );
        if (isCryptocurrency(client?.currency) && has_fiat_account) await this.doSwitch();
    }

    async doSwitch() {
        const { client, modules } = this.root_store;
        const { general_store } = modules.cashier;

        const non_crypto_account_loginid = Object.entries(client.accounts).reduce(
            (initial_value, [loginid, settings]) => {
                return !settings.is_virtual && !isCryptocurrency(settings.currency) ? loginid : initial_value;
            },
            ''
        );
        await client.switchAccount(non_crypto_account_loginid);

        if (this.current_location === 'deposit') {
            general_store.setIsDeposit(true);
        }
    }

    @action.bound
    onCancel() {
        this.should_show = false;
    }

    @action.bound
    continueRoute() {
        if (this.is_confirmed && this.last_location) {
            this.root_store.common.routeTo(this.last_location);
        }
    }
}
