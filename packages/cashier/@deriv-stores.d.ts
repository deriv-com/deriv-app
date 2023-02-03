import type { TStores } from '@deriv/stores';
import type CashierStore from './src/stores/cashier-store';

declare module '@deriv/stores' {
    export function useStore(): TStores & {
        modules: {
            cashier: CashierStore;
        };
    };
}
