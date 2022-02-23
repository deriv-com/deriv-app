import CFDStore from './CFD/cfd-store';

export default class CFDModulesStore {
    constructor(root_store) {
        this.cfd = new CFDStore({ root_store });
    }
}
