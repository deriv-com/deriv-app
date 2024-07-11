import React from 'react';
import { StoreProvider } from '@deriv-lib/stores';
import { TStores } from '@deriv-lib/stores/types';
import type { TWebSocket } from 'Types';
import { DBotStoreProvider } from 'Stores/useDBotStore';

const DBotProviders = ({ children, store, WS }: React.PropsWithChildren<{ store: TStores; WS: TWebSocket }>) => {
    return (
        <StoreProvider store={store}>
            <DBotStoreProvider ws={WS}>{children}</DBotStoreProvider>
        </StoreProvider>
    );
};

export default DBotProviders;
