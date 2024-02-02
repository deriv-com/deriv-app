import React from 'react';
import { APIProvider, AuthProvider } from '@deriv/api';
import { StoreProvider } from '@deriv/stores';
import { TStores } from '@deriv/stores/types';

export const withMockAPIProvider = (mock?: TStores) => {
    if (mock) {
        const MockAPIProviderWithStore = ({ children }: { children: JSX.Element }) => (
            <APIProvider>
                <AuthProvider>
                    <StoreProvider store={mock}>{children}</StoreProvider>
                </AuthProvider>
            </APIProvider>
        );
        return MockAPIProviderWithStore;
    }

    const MockAPIProvider = ({ children }: { children: JSX.Element }) => (
        <APIProvider>
            <AuthProvider>{children}</AuthProvider>
        </APIProvider>
    );
    return MockAPIProvider;
};
