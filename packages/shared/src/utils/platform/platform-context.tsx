import React from 'react';

export const PlatformContext = React.createContext({} as { is_pre_appstore: boolean; is_appstore: boolean });

PlatformContext.displayName = 'DerivAppStorePlatformContext';
