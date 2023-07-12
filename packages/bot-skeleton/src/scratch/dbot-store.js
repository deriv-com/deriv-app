import { reaction } from 'mobx';
import { api_base } from '../services/api/api-base';

class DBotStoreInterface {
    // TODO here we are suppose to define an interface and implement fields of DBotStore.
    handleFileChange = () => {
        throw Error('handleFileChange has not been implemented.');
    };

    toggleStrategyModal = () => {
        throw Error('handleFileChange has not been implemented.');
    };
}

class DBotStore extends DBotStoreInterface {
    static singleton = null;

    constructor(store) {
        super();
        this.is_mobile = store.is_mobile || false;
        this.is_dark_mode_on = store.is_dark_mode_on || false;
        this.client = store.client;
        this.dashboard = store.dashboard;
        this.flyout = store.flyout;
        this.toolbar = store.toolbar;
        this.toolbox = store.toolbox;
        this.save_modal = store.save_modal;
        this.load_modal = store.load_modal;
        this.setContractUpdateConfig = store.setContractUpdateConfig;
        this.toggleStrategyModal = store.toggleStrategyModal;
        this.handleFileChange = store.handleFileChange;
        this.setLoading = store.setLoading;

        reaction(
            () => this.client.loginid,
            () => api_base.createNewInstance(this.client.loginid)
        );
    }

    static setInstance(store) {
        this.singleton = new DBotStore(store);
        return this.instance;
    }

    static get instance() {
        return this.singleton;
    }
}

export default DBotStore;
