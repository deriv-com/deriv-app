import React from 'react';
import { DBotStoreProvider } from 'Stores/useDBotStore';
import { StoreProvider } from '@deriv/stores';
import type { TCoreStores } from '@deriv/stores/types';
import { TWebSocket } from 'Types';

const DBotProviders = ({ children, store, WS }: React.PropsWithChildren<{ store: TCoreStores; WS: TWebSocket }>) => {
    return (
        <StoreProvider store={store}>
            <StoreProvider store={store}>
                <DBotStoreProvider ws={WS}>{children}</DBotStoreProvider>
            </StoreProvider>
        </StoreProvider>
    );
};

export default DBotProviders;
