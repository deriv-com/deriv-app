import { action, observable, computed } from 'mobx';
import { WS } from '@deriv/shared';
import { localize } from '@deriv/translations';
import BaseStore from './base-store';
import {
    crypto_wallets_mapping,
    built_in_wallets,
    e_wallets,
    bankwire,
    credit_debit_card,
} from 'Constants/wallet-types';

type TWalletProvider = {
    fiat_wallets: { getTitle: () => string; content: string[]; popover_text: () => string }[];
    wallets: { getTitle: () => string; content: string[]; popover_text: () => string }[];
};
export default class WalletStore extends BaseStore {
    @observable
    wallet_names: any;

    @computed
    get fiat_currencies() {
        return this.wallet_names?.fiat?.currencies.map((currency: string) => currency.toLowerCase());
    }

    @computed
    get crypto_wallets() {
        return this.wallet_names?.crypto?.currencies.map((currency: string) => crypto_wallets_mapping[currency]);
    }

    @computed
    get wallet_provider(): TWalletProvider {
        const fiat_wallets = [
            { getTitle: () => localize('E-wallets'), content: e_wallets, popover_text: () => '' },
            { getTitle: () => localize('Bankwire'), content: bankwire, popover_text: () => '' },
            { getTitle: () => localize('Credit/Debit card'), content: credit_debit_card, popover_text: () => '' },
        ];

        const wallets = [
            {
                getTitle: () => localize('Fiat currency wallets'),
                content: this.fiat_currencies,
                popover_text: () => localize('***'),
            },
            {
                getTitle: () => localize('Cryptocurrency wallets'),
                content: this.crypto_wallets,
                popover_text: () => '',
            },
            {
                getTitle: () => localize('Deriv P2P and Payment agents wallets'),
                content: built_in_wallets,
                popover_text: () => '',
            },
        ];

        return {
            fiat_wallets,
            wallets,
        };
    }

    @action
    onMount() {
        this.getWalletNames();
    }

    @action.bound
    setWalletNames(data: any) {
        this.wallet_names = data;
    }

    @action.bound
    getWalletNames() {
        if (this.wallet_names) return;
        WS.authorized.storage
            .send({
                get_account_types: 1,
            })
            .then((response: any) => {
                this.setWalletNames(response.get_account_types.wallet);
            });
    }

    @action
    onUnmount() {
        this.wallet_names = null;
    }
}
