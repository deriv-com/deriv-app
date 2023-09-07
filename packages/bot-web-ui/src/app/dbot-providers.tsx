import React from 'react';
import { APIProvider } from '@deriv/api';
import { StoreProvider } from '@deriv/stores';
import type { TRootStore, TWebSocket } from 'Types';
import { DBotStoreProvider } from 'Stores/useDBotStore';

const DBotProviders = ({ children, store, WS }: React.PropsWithChildren<{ store: TRootStore; WS: TWebSocket }>) => {
    return (
        <APIProvider>
            <StoreProvider store={store}>
                <DBotStoreProvider ws={WS}>{children}</DBotStoreProvider>
            </StoreProvider>
        </APIProvider>
    );
};

export default DBotProviders;
