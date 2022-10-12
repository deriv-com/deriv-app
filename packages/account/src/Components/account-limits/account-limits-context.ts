import * as React from 'react';

export type TAccountLimitsContext = {
    currency?: string;
    footer_ref?: React.ReactElement | DocumentFragment | object;
    overlay_ref?:
        | ((...args: unknown[]) => unknown)
        | import('prop-types').InferProps<{
              current: import('prop-types').Requireable<unknown>;
          }>;
    toggleOverlay?: () => boolean;
};

const AccountLimitsContext = React.createContext<TAccountLimitsContext>({
    currency: '',
    footer_ref: undefined,
    overlay_ref: undefined,
    toggleOverlay: undefined,
});

export default AccountLimitsContext;
