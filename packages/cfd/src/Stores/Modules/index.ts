import CFDStore from './CFD/cfd-store';
import { TRootStore } from '../../types';

export default class ModulesStore {
    cfd;

    constructor(root_store: TRootStore) {
        this.cfd = new CFDStore({ root_store });
    }
}
