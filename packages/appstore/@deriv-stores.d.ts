import type { TRootStore } from '@deriv/stores/types';

declare module '@deriv/stores' {
    export function useStore(): TRootStore & {
        modules: {
            cfd: any;
        };
    };
}
