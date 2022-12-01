import * as React from 'react';

export type TAccountLimitsContext = {
    currency: string;
    footer_ref?: React.RefObject<HTMLElement>;
    overlay_ref?: React.RefObject<HTMLElement>;
    toggleOverlay?: () => boolean;
};

const AccountLimitsContext = React.createContext<TAccountLimitsContext>({ currency: '' });

export default AccountLimitsContext;
