import type { TStores } from '@deriv/stores/types';
import type CashierStore from '../stores/cashier-store';

/**
 * @deprecated - Use `TStores` from `@deriv/stores` instead of this type.
 */
export type TRootStore = TStores & {
    modules: {
        cashier: CashierStore;
    };
};
