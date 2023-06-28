import React from 'react';

type TPlatformContext = {
    is_appstore: boolean;
    is_pre_appstore: boolean;
    is_deriv_crypto: boolean;
};

export const PlatformContext = React.createContext<TPlatformContext>({
    is_appstore: false,
    is_pre_appstore: false,
    is_deriv_crypto: false,
});

PlatformContext.displayName = 'DerivAppStorePlatformContext';
