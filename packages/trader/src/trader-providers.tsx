import React from 'react';
import { StoreProvider } from '@deriv/stores';
import { TraderStoreProvider } from 'Stores/useTraderStores';
import type { TCoreStores } from '@deriv/stores/types';

export const TraderProviders = ({ children, store }: React.PropsWithChildren<{ store: TCoreStores }>) => {
    return (
        <StoreProvider store={store}>
            <TraderStoreProvider>{children}</TraderStoreProvider>
        </StoreProvider>
    );
};

export default TraderProviders;
