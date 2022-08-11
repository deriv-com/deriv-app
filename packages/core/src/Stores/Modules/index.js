export default class ModulesStore {
    attachModule(name, module) {
        this[name] = module;
    }

    detachModule(name) {
        this[name] = {};
    }
}
