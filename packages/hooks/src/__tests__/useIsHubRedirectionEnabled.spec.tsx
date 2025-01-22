import React from 'react';

import { mockStore, StoreProvider } from '@deriv/stores';
import { renderHook } from '@testing-library/react-hooks';

import useAuthorize from '../useAuthorize';
import useGrowthbookGetFeatureValue from '../useGrowthbookGetFeatureValue';
import useIsHubRedirectionEnabled from '../useIsHubRedirectionEnabled';

jest.mock('../useGrowthbookGetFeatureValue', () =>
    jest.fn(() => [
        {
            hub_enabled_country_list: [''],
        },
    ])
);

jest.mock('../useAuthorize', () =>
    jest.fn(() => ({
        data: {
            country: 'UK',
        },
    }))
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
                hub_enabled_country_list: ['US', 'AU', 'UK'],
            },
        ]);
        (useAuthorize as jest.Mock).mockReturnValue({
            data: {
                country: 'UK',
            },
        });
    });

    const wrapper = ({ children }: { children: JSX.Element }) => (
        <StoreProvider store={mock_store}>{children}</StoreProvider>
    );

    it('should return initial state correctly', () => {
        (useGrowthbookGetFeatureValue as jest.Mock).mockReturnValue([
            {
                hub_enabled_country_list: ['AU'],
            },
        ]);
        const { result } = renderHook(() => useIsHubRedirectionEnabled(), { wrapper });

        expect(result.current.isHubRedirectionEnabled).toBe(false);
    });

    it('should return true if authorize country is in the hub enabled list', () => {
        const { result } = renderHook(() => useIsHubRedirectionEnabled(), { wrapper });
        expect(result.current.isHubRedirectionEnabled).toBe(true);
    });

    it('should return true if client country is in the hub enabled list and authorize is undefined', () => {
        (useAuthorize as jest.Mock).mockReturnValue({
            data: undefined,
        });
        const { result } = renderHook(() => useIsHubRedirectionEnabled(), { wrapper });
        expect(result.current.isHubRedirectionEnabled).toBe(true);
    });

    it('should return false if authorize and client country is not in the hub enabled list', () => {
        (useGrowthbookGetFeatureValue as jest.Mock).mockReturnValue([
            {
                hub_enabled_country_list: ['AU'],
            },
        ]);
        const { result } = renderHook(() => useIsHubRedirectionEnabled(), { wrapper });
        expect(result.current.isHubRedirectionEnabled).toBe(false);
    });
});
