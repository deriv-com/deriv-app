import React from 'react';
import { APIProvider, usePaginatedFetch } from '@deriv/api';
import { StoreProvider, mockStore } from '@deriv/stores';
import { renderHook } from '@testing-library/react-hooks';
import useP2PAdvertList from '../useP2PAdvertList';
import useP2POrderList from '../useP2POrderList';

type TWrapper = {
    children: JSX.Element;
};

jest.mock('@deriv/api', () => ({
    ...jest.requireActual('@deriv/api'),
    usePaginatedFetch: jest.fn(),
}));

const mockUsePaginatedFetch = usePaginatedFetch as jest.MockedFunction<typeof usePaginatedFetch<'p2p_order_list'>>;

describe('useP2POrdertList', () => {
    it('should return undefined if there is no response', () => {
        const mock_store = mockStore({});
        // @ts-expect-error need to come up with a way to mock the return type of usePaginatedFetch
        mockUsePaginatedFetch.mockReturnValue({});

        const wrapper = ({ children }: TWrapper) => (
            <APIProvider>
                <StoreProvider store={mock_store}>{children}</StoreProvider>
            </APIProvider>
        );

        const { result } = renderHook(() => useP2POrderList(), { wrapper });
        expect(result.current.data).toBe(undefined);
    });
});
