import React from 'react';
import { APIProvider } from '@deriv/api';
import { StoreProvider } from '@deriv/stores';
import { TraderStoreProvider } from 'Stores/useTraderStores';
import type { TCoreStores } from '@deriv/stores/types';

export const TraderProviders = ({ children, store }: React.PropsWithChildren<{ store: TCoreStores }>) => {
    return (
        <APIProvider>
            <StoreProvider store={store}>
                <TraderStoreProvider>{children}</TraderStoreProvider>
            </StoreProvider>
        </APIProvider>
    );
};

export default TraderProviders;
