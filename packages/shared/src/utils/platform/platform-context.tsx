import React from 'react';

export type TPlatformContext = {
    is_appstore?: boolean;
    is_pre_appstore?: boolean;
};

export const PlatformContext = React.createContext<TPlatformContext>({});

PlatformContext.displayName = 'DerivAppStorePlatformContext';
