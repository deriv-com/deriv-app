import type { TStores } from '@deriv/stores';
import type { TCFDStore } from './cfd-store.types';

export type TRootStore = TStores & {
    modules: {
        cfd: TCFDStore;
    };
};
