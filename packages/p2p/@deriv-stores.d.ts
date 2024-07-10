import type { TCoreStores } from '@deriv-app/stores/types';
import type P2PStore from './src/stores';

declare module '@deriv-app/stores' {
    export function useStore(): TCoreStores & {
        modules: {
            p2p: P2PStore;
        };
    };
}
