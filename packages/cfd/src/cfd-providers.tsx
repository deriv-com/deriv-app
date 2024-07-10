import React from 'react';
import { StoreProvider } from '@deriv-app/stores';
import { CFDStoreProvider } from './Stores/Modules/CFD/Helpers/useCfdStores';
import type { TCoreStores } from '@deriv-app/stores/types';

const CFDProviders = ({ children, store }: React.PropsWithChildren<{ store: TCoreStores }>) => {
    return (
        <StoreProvider store={store}>
            <CFDStoreProvider>{children}</CFDStoreProvider>
        </StoreProvider>
    );
};

export default CFDProviders;
