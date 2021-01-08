import RootStore from './root-store';

export default class BaseStore {
    public root_store: RootStore;
    public ws: any;

    public constructor(root_store: RootStore) {
        this.root_store = root_store;
        this.ws = root_store.ws;
    }
}
