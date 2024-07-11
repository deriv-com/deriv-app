import type { TCoreStores } from '@deriv-lib/stores/types';
import type P2PStore from './src/stores';

declare module '@deriv-lib/stores' {
    export function useStore(): TCoreStores & {
        modules: {
            p2p: P2PStore;
        };
    };
}
