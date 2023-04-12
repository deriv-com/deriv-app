import type { TCoreStores } from '@deriv/stores/types';
import type CFDStore from './src/Stores/Modules/CFD/cfd-store';

declare module '@deriv/stores' {
    export function useStore(): TCoreStores & {
        modules: {
            cfd: CFDStore;
        };
    };
}
