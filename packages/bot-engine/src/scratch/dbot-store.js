class DBotStoreInterface {
    // TODO here we are suppose to define an interface and implement fields of DBotStore.
}

class DBotStore extends DBotStoreInterface {
    static singleton = null;

    constructor(store) {
        super();
        this.is_mobile       = store.is_mobile || false;
        this.is_dark_mode_on = store.is_dark_mode_on || false;
        this.client          = store.client;
        this.flyout          = store.flyout || {};
        this.toolbar         = store.toolbar || {};
        this.quick_strategy  = store.quick_strategy || {};
    }

    static setInstance(store) {
        if (!this.singleton) {
            this.singleton = new DBotStore(store);
        }

        return this.instance;
    }

    static get instance() {
        return this.singleton;
    }

}

export default DBotStore;
