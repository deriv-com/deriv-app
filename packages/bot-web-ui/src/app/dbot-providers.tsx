import React from 'react';
import { DBotStoreProvider } from 'Stores/useDBotStore';
import { StoreProvider } from '@deriv/stores';
import type { TWebSocket } from 'Types';
import type { TCoreStores } from '@deriv/stores/types';

const DBotProviders = ({ children, store, WS }: React.PropsWithChildren<{ store: TCoreStores; WS: TWebSocket }>) => {
    return (
        <StoreProvider store={store}>
            <DBotStoreProvider ws={WS}>{children}</DBotStoreProvider>
        </StoreProvider>
    );
};

export default DBotProviders;
