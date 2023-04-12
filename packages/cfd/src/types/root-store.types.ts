import type { TStores } from '@deriv/stores';
import type CFDStore from '../Stores/Modules/CFD/cfd-store';

export type TRootStore = TStores & {
    modules: {
        cfd: CFDStore;
    };
};
