import type { TStores } from '@deriv/stores';
import type RootStore from './src/stores/index';

declare module '@deriv/stores' {
    export function useStore(): TStores & {
        modules: {
            p2p: RootStore;
        };
    };
}
