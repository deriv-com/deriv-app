import React from 'react';

export const PlatformContext = React.createContext({ is_appstore: false });

PlatformContext.displayName = 'DerivAppStorePlatformContext';
