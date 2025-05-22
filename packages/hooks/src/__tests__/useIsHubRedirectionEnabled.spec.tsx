import React from 'react';

import { mockStore, StoreProvider } from '@deriv/stores';
import { renderHook } from '@testing-library/react-hooks';

import useIsHubRedirectionEnabled from '../useIsHubRedirectionEnabled';

jest.mock('@deriv/api', () => ({
    useRemoteConfig: jest.fn(() => ({
        data: {
            hub_enabled_country_list: ['US', 'AU', 'UK'],
        },
    })),
}));

describe('useIsHubRedirectionEnabled', () => {
    const mock_store = mockStore({
        client: {
            account_settings: { country_code: 'US' },
            clients_country: 'US',
        },
    });

    beforeEach(() => {
        mock_store.client.clients_country = 'US';
        mock_store.client.account_settings.country_code = 'US';
    });

    const wrapper = ({ children }: { children: JSX.Element }) => (
        <StoreProvider store={mock_store}>{children}</StoreProvider>
    );

    it('should return initial state correctly', () => {
        const { result } = renderHook(() => useIsHubRedirectionEnabled(), { wrapper });

        expect(result.current.isHubRedirectionEnabled).toBe(true);
        expect(result.current.isChangingToHubAppId).toBe(true);
    });

    it('should return false if client country is not in the hub enabled list', () => {
        mock_store.client.account_settings.country_code = 'Canada';
        const { result } = renderHook(() => useIsHubRedirectionEnabled(), { wrapper });

        expect(result.current.isHubRedirectionEnabled).toBe(false);
    });

    it('should return true if client country is in the hub enabled list', () => {
        mock_store.client.account_settings.country_code = 'AU';
        const { result } = renderHook(() => useIsHubRedirectionEnabled(), { wrapper });

        expect(result.current.isHubRedirectionEnabled).toBe(true);
    });

    it('should return isChangingToHubAppId true if client country is in the hub enabled list but not in the country_code list', () => {
        mock_store.client.clients_country = 'UK';
        mock_store.client.account_settings.country_code = 'Canada';
        const { result } = renderHook(() => useIsHubRedirectionEnabled(), { wrapper });

        expect(result.current.isChangingToHubAppId).toBe(true);
    });
});
