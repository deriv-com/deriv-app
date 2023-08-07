import type { TStores } from '@deriv/stores/types';
import type CFDStore from '../Stores/Modules/CFD/cfd-store';

/**
 * @deprecated - Use `TStores` from `@deriv/stores` instead of this type.
 */
export type TRootStore = TStores & {
    modules: {
        cfd: CFDStore;
    };
};
