import { useStore } from '@deriv/stores';

export type TRootStore = ReturnType<typeof useStore>;
export type TClientStore = TRootStore['client'];
export type TCommonStore = TRootStore['common'];
export type TUiStore = TRootStore['ui'];
