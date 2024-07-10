import React from 'react';
import { APIProvider } from '@deriv-app/api';
import { P2PSettingsProvider, StoreProvider } from '@deriv-app/stores';
import { TStores } from '@deriv-app/stores/types';

export const withMockAPIProvider = (mock?: TStores, has_p2p_settings?: boolean) => {
    if (mock) {
        if (has_p2p_settings) {
            const MockAPIProviderWithP2PSettings = ({ children }: { children: JSX.Element }) => (
                <APIProvider>
                    <StoreProvider store={mock}>
                        <P2PSettingsProvider>{children}</P2PSettingsProvider>
                    </StoreProvider>
                </APIProvider>
            );
            return MockAPIProviderWithP2PSettings;
        }
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
