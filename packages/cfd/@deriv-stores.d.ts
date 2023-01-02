import type { TRootStore } from '@deriv/stores/types';
import type CFDStore from './src/Stores/Modules/CFD/cfd-store';

declare module '@deriv/stores' {
    export function useStore(): TRootStore & {
        modules: {
            cfd: CFDStore;
        };
    };
}
