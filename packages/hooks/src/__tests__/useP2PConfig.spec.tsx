import React from 'react';
import { APIProvider, useFetch } from '@deriv/api';
import { StoreProvider, mockStore } from '@deriv/stores';
import { renderHook } from '@testing-library/react-hooks';
import useP2PConfig from '../useP2PConfig';

type TWrapper = {
    children: JSX.Element;
};

jest.mock('@deriv/api', () => ({
    ...jest.requireActual('@deriv/api'),
    useFetch: jest.fn(),
}));

const mockUseFetch = useFetch as jest.MockedFunction<typeof useFetch<'website_status'>>;
const mock_store = mockStore({
    client: {
        currency: 'USD',
    },
});
const mock_data = {
    data: {
        website_status: {
            p2p_config: {
                payment_methods_enabled: 1,
                adverts_active_limit: 3,
                adverts_archive_period: 3,
                supported_currencies: ['usd'],
            },
        },
    },
};

const wrapper = ({ children }: TWrapper) => (
    <APIProvider>
        <StoreProvider store={mock_store}>{children}</StoreProvider>
    </APIProvider>
);

describe('useP2PConfig', () => {
    it('should return undefined if there is no response', () => {
        // @ts-expect-error need to come up with a way to mock the return type of useFetch
        mockUseFetch.mockReturnValue({});
        const { result } = renderHook(() => useP2PConfig(), { wrapper });
        expect(result.current.p2p_config).toBe(undefined);
    });

    it('should return the p2p_config object from response', () => {
        // @ts-expect-error need to come up with a way to mock the return type of useFetch
        mockUseFetch.mockReturnValue(mock_data);
        const { result } = renderHook(() => useP2PConfig(), { wrapper });
        const p2p_config = result.current.p2p_config;

        expect(p2p_config?.payment_methods_enabled).toBe(1);
        expect(p2p_config?.adverts_active_limit).toBe(3);
        expect(p2p_config?.adverts_archive_period).toBe(3);
        expect(p2p_config?.supported_currencies).toStrictEqual(['usd']);
    });
});
