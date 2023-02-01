import type { TStores } from '@deriv/stores';
import type CashierStore from '../../stores/cashier-store';

export type TRootStore = TStores & {
    modules: {
        cashier: CashierStore;
    };
};
