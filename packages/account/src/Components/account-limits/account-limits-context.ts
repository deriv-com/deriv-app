import * as React from 'react';

export type TAccountLimitsContext = {
    currency?: string;
    footer_ref?: React.ReactElement | DocumentFragment | object;
    overlay_ref?: React.RefObject<HTMLElement>;
    toggleOverlay?: () => boolean;
};

const AccountLimitsContext = React.createContext<TAccountLimitsContext>({});

export default AccountLimitsContext;
