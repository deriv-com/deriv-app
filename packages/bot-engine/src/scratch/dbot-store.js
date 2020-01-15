class DBotStoreInterface {
    toggleQickStrategyModal = () => {
        throw new Error('Not Implemented.');
    }
}

class DBotStore extends DBotStoreInterface {
    static singleton = null;

    constructor(_store) {
        super();
        this.is_mobile       = _store.is_mobile || false;
        this.is_dark_mode_on = _store.is_dark_mode_on || false;
        this.flyout          = _store.flyout || {};
        this.toolbar         = _store.toolbar || {};
        this.quick_strategy  = _store.quick_strategy || {};
    }

    static setInstance(_store) {
        if (!this.singleton) {
            this.singleton = new DBotStore(_store);
        }

        return this.instance;
    }

    static get instance() {
        return this.singleton;
    }

}

export default DBotStore;
