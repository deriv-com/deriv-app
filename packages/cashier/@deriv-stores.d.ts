import type { TStore } from '@deriv/stores';
import type CashierStore from './src/stores/cashier-store';

declare module '@deriv/stores' {
    export function useStore(): TStore & {
        modules: {
            cashier: CashierStore;
        };
    };
}
