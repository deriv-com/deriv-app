import React from 'react';
import { StoreProvider } from '@deriv/stores';
import type { TRootStore, TWebSocket } from 'Types';
import { DBotStoreProvider } from 'Stores/useDBotStore';

const DBotProviders = ({ children, store, WS }: React.PropsWithChildren<{ store: TRootStore; WS: TWebSocket }>) => {
    return (
        <StoreProvider store={store}>
            <DBotStoreProvider ws={WS}>{children}</DBotStoreProvider>
        </StoreProvider>
    );
};

export default DBotProviders;
