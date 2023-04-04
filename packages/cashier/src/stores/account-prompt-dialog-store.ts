import { observable, action, makeObservable } from 'mobx';
import { isCryptocurrency } from '@deriv/shared';
import type { TRootStore } from 'Types';

export default class AccountPromptDialogStore {
    constructor(public root_store: TRootStore) {
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
    }

    should_show = false;
    is_confirmed = false;
    last_location: string | null = null;
    current_location: string | null = null;

    shouldNavigateAfterPrompt(next_location: string, current_location: string) {
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
        const { client } = this.root_store;

        this.should_show = false;
        this.is_confirmed = true;

        const has_fiat_account = Object.values(client.accounts).some(
            acc_settings => !acc_settings.is_virtual && !isCryptocurrency(acc_settings.currency || '')
        );
        if (isCryptocurrency(client?.currency) && has_fiat_account) await this.doSwitch();
    }

    async doSwitch() {
        const { client, modules } = this.root_store;
        const { general_store } = modules.cashier;

        const non_crypto_account_loginid = Object.entries(client.accounts).reduce(
            (initial_value, [loginid, settings]) => {
                return !settings.is_virtual && !isCryptocurrency(settings.currency || '') ? loginid : initial_value;
            },
            ''
        );
        await client.switchAccount(non_crypto_account_loginid);

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
