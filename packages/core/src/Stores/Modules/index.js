export default class ModulesStore {
    constructor(root_store) {
        this.root_store = root_store;
    }

    attachModule(name, module) {
        this[name] = module;
    }

    detachModule(name) {
        this[name] = {};
    }
}
