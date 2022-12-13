import type { TRootStore } from '@deriv/stores/types';
import type CashierStore from './src/stores/cashier-store';

declare module '@deriv/stores' {
    export function useStore(): TRootStore & {
        modules: {
            cashier: CashierStore;
        };
    };
}
