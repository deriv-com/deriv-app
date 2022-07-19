import CFDStore from './CFD/cfd-store';

export default class ModulesStore {
    constructor(root_store) {
        this.cfd = new CFDStore({ root_store });
    }
}
