import React from 'react';
import { APIProvider } from '@deriv/api';
import { StoreProvider } from '@deriv/stores';
import { CFDStoreProvider } from './Stores/Modules/CFD/Helpers/useCfdStores';
import type { TCoreStores } from '@deriv/stores/types';

const CFDProviders = ({ children, store }: React.PropsWithChildren<{ store: TCoreStores }>) => {
    return (
        <APIProvider>
            <StoreProvider store={store}>
                <CFDStoreProvider>{children}</CFDStoreProvider>
            </StoreProvider>
        </APIProvider>
    );
};

export default CFDProviders;
