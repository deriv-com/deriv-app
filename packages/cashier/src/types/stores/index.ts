import { TRootStore as TRootStoreBase } from '@deriv/stores/types';
import type CashierStore from '../../stores/cashier-store';

export type TRootStore = TRootStoreBase & {
    modules: {
        cashier: CashierStore;
    };
};

export type TClientStore = TRootStore['client'];
export type TCommonStore = TRootStore['common'];
export type TUiStore = TRootStore['ui'];
