import type { TStores } from '@deriv-lib/stores/types';
import type CashierStore from '../stores/cashier-store';

/**
 * @deprecated - Use `TStores` from `@deriv-lib/stores` instead of this type.
 */
export type TRootStore = TStores & {
    modules: {
        cashier: CashierStore;
    };
};
