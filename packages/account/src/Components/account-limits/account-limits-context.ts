import * as React from 'react';

export type TContextValue = {
    currency?: string;
    footer_ref?: React.ReactElement | DocumentFragment | object;
    overlay_ref?:
        | ((...args: unknown[]) => unknown)
        | import('prop-types').InferProps<{
              current: import('prop-types').Requireable<unknown>;
          }>;
    toggleOverlay?: () => boolean;
};

const AccountLimitsContext = React.createContext<TContextValue>({
    currency: '',
    footer_ref: undefined,
    overlay_ref: undefined,
    toggleOverlay: undefined,
});

export default AccountLimitsContext;
