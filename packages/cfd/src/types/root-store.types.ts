import type { TCoreStores } from '@deriv/stores/types';
import type CFDStore from '../Stores/Modules/CFD/cfd-store';

/**
 * @deprecated - Use `TCoreStores` from `@deriv/stores` instead of this type.
 */
export type TRootStore = TCoreStores & {
    modules: {
        cfd: CFDStore;
    };
};
