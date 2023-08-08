import CFDStore from './CFD/cfd-store';
import type { TCoreStores } from '@deriv/stores/types';

export default class ModulesStore {
    cfd;

    constructor(root_store: TCoreStores) {
        this.cfd = new CFDStore({ root_store });
    }
}
