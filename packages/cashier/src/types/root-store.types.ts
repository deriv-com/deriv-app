import type { TStores } from '@deriv-app/stores/types';
import type CashierStore from '../stores/cashier-store';

/**
 * @deprecated - Use `TStores` from `@deriv-app/stores` instead of this type.
 */
export type TRootStore = TStores & {
    modules: {
        cashier: CashierStore;
    };
};
