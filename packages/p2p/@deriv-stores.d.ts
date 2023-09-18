import type { TCoreStores } from '@deriv/stores/types';
import type P2PStore from './src/stores';

declare module '@deriv/stores' {
    export function useStore(): TCoreStores & {
        modules: {
            p2p: P2PStore;
        };
    };
}
