class ScratchStore {
    static singleton = null;

    constructor(root_store) {
        this.root_store = root_store;
        this.flyout     = root_store.flyout;
        this.toolbar    = root_store.toolbar;
    }

    static setInstance(root_store) {
        if (!this.singleton) {
            this.singleton = new ScratchStore(root_store);
        }

        return this.instance;
    }

    static get instance() {
        return this.singleton;
    }
}

export default ScratchStore;
