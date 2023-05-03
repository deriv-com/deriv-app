import React from 'react';
import { DBotStoreProvider } from 'Stores/useDBotStore';
import { StoreProvider } from '@deriv/stores';
import type { TWebSocket, TRootStore } from 'Types';

const DBotProviders = ({ children, store, WS }: React.PropsWithChildren<{ store: TRootStore; WS: TWebSocket }>) => {
    return (
        <StoreProvider store={store}>
            <DBotStoreProvider ws={WS}>{children}</DBotStoreProvider>
        </StoreProvider>
    );
};

export default DBotProviders;
