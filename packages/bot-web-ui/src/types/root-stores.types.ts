import type { TCoreStores } from '@deriv/stores/types';

/**
 * @deprecated - Use `TStores` from `@deriv/stores` instead of this type.
 */
export type TRootStore = TCoreStores & {
    gtm?: Record<string, unknown>;
    portfolio?: Record<string, unknown>;
};
