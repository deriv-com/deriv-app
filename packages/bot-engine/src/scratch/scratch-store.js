class ScratchStoreInterface {
    toggleQickStrategyModal = () => {
        throw new Error('Not Implemented.');
    }
}

class ScratchStore extends ScratchStoreInterface {
    static singleton = null;

    constructor(store) {
        super();
        this.store          = store;
        this.is_mobile      = this.store.is_mobile || false;
        this.flyout         = this.store.flyout || {};
        this.toolbar        = this.store.is_toolbox_open || false;
        this.quick_strategy = this.store.quick_strategy || {};
    }

    static setInstance(store) {
        if (!this.singleton) {
            this.singleton = new ScratchStore(store);
        }

        return this.instance;
    }

    static get instance() {
        return this.singleton;
    }

}

export default ScratchStore;
