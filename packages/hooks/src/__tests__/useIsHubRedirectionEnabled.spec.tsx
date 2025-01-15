import React from 'react';
import { renderHook } from '@testing-library/react-hooks';

import useGrowthbookGetFeatureValue from '../useGrowthbookGetFeatureValue';
import useIsHubRedirectionEnabled from '../useIsHubRedirectionEnabled';
import { mockStore, StoreProvider } from '@deriv/stores';

jest.mock('../useGrowthbookGetFeatureValue', () =>
    jest.fn(() => [
        {
            hub_enabled_country_list: [''],
        },
    ])
);

describe('useIsHubRedirectionEnabled', () => {
    const mock_store = mockStore({
        client: {
            clients_country: 'US',
        },
    });

    beforeEach(() => {
        mock_store.client.clients_country = 'US';
        (useGrowthbookGetFeatureValue as jest.Mock).mockReturnValue([
            {
                hub_enabled_country_list: ['AU'],
            },
        ]);
    });

    const wrapper = ({ children }: { children: JSX.Element }) => (
        <StoreProvider store={mock_store}>{children}</StoreProvider>
    );

    it('should return initial state correctly', () => {
        const { result } = renderHook(() => useIsHubRedirectionEnabled(), { wrapper });

        expect(result.current.isHubRedirectionEnabled).toBe(false);
        expect(result.current.isChangingToHubAppId).toBe(false);
    });

    it('should return true if client country is in the hub enabled list', () => {
        mock_store.client.clients_country = 'UK';
        (useGrowthbookGetFeatureValue as jest.Mock).mockReturnValue([
            {
                hub_enabled_country_list: ['US', 'AU', 'UK'],
            },
        ]);
        const { result } = renderHook(() => useIsHubRedirectionEnabled(), { wrapper });
        expect(result.current.isHubRedirectionEnabled).toBe(true);
    });

    it('should return isChangingToHubAppId true if client country is in the hub enabled list but not in the citizen list', () => {
        mock_store.client.clients_country = 'UK';
        (useGrowthbookGetFeatureValue as jest.Mock).mockReturnValue([
            {
                hub_enabled_country_list: ['US', 'AU', 'UK'],
            },
        ]);
        const { result } = renderHook(() => useIsHubRedirectionEnabled(), { wrapper });
        expect(result.current.isChangingToHubAppId).toBe(true);
    });
});
