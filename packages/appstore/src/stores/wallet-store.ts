import { action, computed, observable, toJS } from 'mobx';
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
    fiat_wallets: { getTitle: () => string; content: string[]; popover_text: () => string; has_information: boolean }[];
    wallets: { getTitle: () => string; content: string[]; popover_text: () => string; has_information: boolean }[];
};
export default class WalletStore extends BaseStore {
    @observable
    account_types: any;
    @observable real_wallet_account: any;

    @computed
    get wallet_names() {
        return this.account_types?.wallet;
    }

    @computed
    get fiat_currencies() {
        return toJS(this.wallet_names)?.fiat?.currencies_available.map((currency: string) => currency.toLowerCase());
    }

    @computed
    get crypto_wallets() {
        return toJS(this.wallet_names)?.crypto?.currencies_available.map(
            (currency: string) => crypto_wallets_mapping[currency]
        );
    }

    @computed
    get wallet_provider(): TWalletProvider {
        const fiat_wallets = [
            {
                getTitle: () => localize('E-wallets'),
                content: e_wallets,
                popover_text: () => '',
                has_information: false,
            },
            { getTitle: () => localize('Bankwire'), content: bankwire, popover_text: () => '', has_information: false },
            {
                getTitle: () => localize('Credit/Debit card'),
                content: credit_debit_card,
                popover_text: () => '',
                has_information: false,
            },
        ];

        const wallets = [
            {
                getTitle: () => localize('Fiat currency wallets'),
                content: this.fiat_currencies,
                popover_text: () => localize('***'),
                has_information: true,
            },
            {
                getTitle: () => localize('Cryptocurrency wallets'),
                content: this.crypto_wallets,
                popover_text: () => '',
                has_information: false,
            },
            {
                getTitle: () => localize('Deriv P2P and Payment agents wallets'),
                content: built_in_wallets,
                popover_text: () => '',
                has_information: false,
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
    setAccountTypes(data: any) {
        this.account_types = data;
    }

    @action.bound
    async getWalletNames() {
        if (this.wallet_names) return;
        const response = await WS.authorized.storage.send({
            get_account_types: 1,
        });

        if (response) this.setAccountTypes(response.get_account_types);
    }

    @action
    onUnmount() {
        this.account_types = null;
    }

    @action.bound
    setRealWalletAcount(real_wallet_account: any) {
        this.real_wallet_account = real_wallet_account;
    }

    @action.bound
    async createRealWalletAccount(create_wallet_data: any) {
        if (!create_wallet_data) return;

        const response = await WS.authorized.send({
            new_account_wallet: 1,
            ...create_wallet_data,
        });

        if (response) this.setRealWalletAcount(response);
    }
}
