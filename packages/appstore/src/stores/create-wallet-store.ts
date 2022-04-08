import { observable, action } from 'mobx';
import RootStore from './root-store';

export default class CreateWalletStore {
    public root_store: RootStore;

    public constructor(root_store: RootStore) {
        this.root_store = root_store;
    }

    @observable selected_wallet = '';

    @action.bound
    setSelectedWallet(wallet: string) {
        this.selected_wallet = wallet;
    }
}
