// This is a workaround for overriding the wrong types in RootStore and adding cashier store types,
// Once we refactor the RootStore in Core package to TS we should be able to remove this file.

import CashierStore from '../../stores/cashier-store';

type TCoreRootStore = NonNullable<import('@deriv/core').TRootStore>;

export type TRootStore = TCoreRootStore & {
    modules: {
        cashier: CashierStore;
    };
};
