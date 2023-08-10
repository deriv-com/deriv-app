import React from 'react';
import { APIProvider, useRequest } from '@deriv/api';
import { renderHook } from '@testing-library/react-hooks';
import useNewWalletCreation from '../useCreateWallet';
import { StoreProvider, mockStore } from '@deriv/stores';

jest.mock('@deriv/api', () => ({
    ...jest.requireActual('@deriv/api'),
    useFetch: jest.fn(),
    useRequest: jest.fn(() => ({ mutate: jest.fn() })),
}));

// @ts-expect-error need to come up with a way to mock the return type of useRequest
const mockUseRequest = useRequest as jest.MockedFunction<typeof useRequest<'new_account_wallet'>>;

describe('useNewWalletCreation', () => {
    test('should return undefined if the response is not ready yet', () => {
        // @ts-expect-error need to come up with a way to mock the return type of useRequest
        mockUseRequest.mockReturnValue({});

        const mock = mockStore({});

        const wrapper = ({ children }: { children: JSX.Element }) => (
            <APIProvider>
                <StoreProvider store={mock}>{children}</StoreProvider>
            </APIProvider>
        );

        const { result } = renderHook(() => useNewWalletCreation(), { wrapper });

        expect(result.current.data).toBeUndefined();
    });

    test('should send payload', () => {
        const mockResponse = {
            new_account_wallet: {
                client_id: 'CR12345',
                currency: 'USD',
                landing_company: 'svg',
                oauth_token: '12345',
            },
        };

        // @ts-expect-error need to come up with a way to mock the return type of useRequest
        mockUseRequest.mockReturnValue({
            data: mockResponse,
        });

        const mock = mockStore({
            client: {
                accountRealReaction: jest.fn(),
            },
        });

        const wrapper = ({ children }: { children: JSX.Element }) => (
            <APIProvider>
                <StoreProvider store={mock}>{children}</StoreProvider>
            </APIProvider>
        );

        const { result } = renderHook(() => useNewWalletCreation(), { wrapper });

        expect(result.current.data).toEqual(mockResponse.new_account_wallet);
    });
});
