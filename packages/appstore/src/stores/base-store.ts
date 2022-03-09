import RootStore from './root-store';

export default class BaseStore {
    public root_store: RootStore;

    public constructor(root_store: RootStore) {
        this.root_store = root_store;
    }
}
