import React from 'react';

export const PlatformContext = React.createContext({} as { is_appstore: boolean });

PlatformContext.displayName = 'DerivAppStorePlatformContext';
