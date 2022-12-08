import type { TRootStore } from '@deriv/stores/types';
import type P2PStore from './src/stores/p2p-store';

declare module '@deriv/stores' {
    export function useStore(): TRootStore & {
        modules: {
            p2p_store: P2PStore;
        };
    };
}
