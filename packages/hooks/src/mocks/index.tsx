import React from 'react';
import { APIProvider } from '@deriv/api';
import { StoreProvider } from '@deriv/stores';
import { TStores } from '@deriv/stores/types';

export const withMockAPIProvider = (mock?: TStores) => {
    if (mock) {
        const MockAPIProviderWithStore = ({ children }: { children: JSX.Element }) => (
            <APIProvider>
                <StoreProvider store={mock}>{children}</StoreProvider>
            </APIProvider>
        );
        return MockAPIProviderWithStore;
    }

    const MockAPIProvider = ({ children }: { children: JSX.Element }) => <APIProvider>{children}</APIProvider>;
    return MockAPIProvider;
};
