import React from 'react';
import { APIProvider, useFetch, useRequest } from '@deriv/api';
import { renderHook } from '@testing-library/react-hooks';
import { StoreProvider, mockStore } from '@deriv/stores';
import useWalletMigration from '../useWalletMigration';

jest.mock('@deriv/api', () => ({
    ...jest.requireActual('@deriv/api'),
    useFetch: jest.fn(),
    useRequest: jest.fn(() => ({ mutate: jest.fn() })),
}));

const mockUseFetch = useFetch as jest.MockedFunction<typeof useFetch<'wallet_migration'>>;
const mockUseRequest = useRequest as jest.MockedFunction<typeof useRequest<'wallet_migration'>>;

describe('useWalletMigration', () => {
    const mock = mockStore({});
    const wrapper = (mock: ReturnType<typeof mockStore>) => {
        const Component = ({ children }: { children: JSX.Element }) => {
            return (
                <APIProvider>
                    <StoreProvider store={mock}>{children}</StoreProvider>
                </APIProvider>
            );
        };
        return Component;
    };

    test('should return wallet migration state', () => {
        // @ts-expect-error need to come up with a way to mock the return type of useFetch
        mockUseFetch.mockReturnValue({ data: { wallet_migration: { state: 'eligible' } } });

        const { result } = renderHook(() => useWalletMigration(), { wrapper: wrapper(mock) });

        expect(result.current.state).toBe('eligible');
    });

    test('should send start wallet migration request', () => {
        // @ts-expect-error need to come up with a way to mock the return type of useRequest
        mockUseRequest.mockReturnValue({ mutate: jest.fn() });

        const { result } = renderHook(() => useWalletMigration(), { wrapper: wrapper(mock) });

        result.current.start_migration();

        expect(mockUseRequest('wallet_migration').mutate).toBeCalledWith({ payload: { wallet_migration: 'start' } });
    });

    test('should send reset wallet migration request', () => {
        // @ts-expect-error need to come up with a way to mock the return type of useRequest
        mockUseRequest.mockReturnValue({ mutate: jest.fn() });

        const { result } = renderHook(() => useWalletMigration(), { wrapper: wrapper(mock) });

        result.current.reset_migration();

        expect(mockUseRequest('wallet_migration').mutate).toBeCalledWith({ payload: { wallet_migration: 'reset' } });
    });
});
