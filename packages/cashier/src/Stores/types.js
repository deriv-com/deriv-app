export default class RootStore {
    constructor(core_store) {
        this.client = core_store.client;
        this.modules = core_store.modules;
    }
}
