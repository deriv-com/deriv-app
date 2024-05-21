import React from 'react';

export type TAccountLimitsContext = {
    currency: string;
    footer_ref?: React.RefObject<HTMLElement>;
    overlay_ref?: HTMLDivElement;
    toggleOverlay?: () => void;
};

const AccountLimitsContext = React.createContext<TAccountLimitsContext>({
    currency: '',
});

export default AccountLimitsContext;
