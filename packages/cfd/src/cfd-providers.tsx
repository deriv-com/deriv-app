import React from 'react';
import { StoreProvider } from '@deriv/stores';
import { TRootStore } from './types/root-store.types';
import { CFDStoreProvider } from 'Stores/Modules/CFD/Helpers/useCfdStores';

const CFDProviders = ({ children, store }: React.PropsWithChildren<{ store: TRootStore }>) => {
    return (
        <StoreProvider store={store}>
            <CFDStoreProvider>{children}</CFDStoreProvider>
        </StoreProvider>
    );
};

export default CFDProviders;
