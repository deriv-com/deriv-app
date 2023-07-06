import React from 'react';
import { APIProvider, useFetch } from '@deriv/api';
import { renderHook } from '@testing-library/react-hooks';
import { StoreProvider, mockStore } from '@deriv/stores';
import useAuthorize from '../useAuthorize';

jest.mock('@deriv/api', () => ({
    ...jest.requireActual('@deriv/api'),
    useFetch: jest.fn(),
}));

const mockUseFetch = useFetch as jest.MockedFunction<typeof useFetch<'authorize'>>;

describe('useAuthorize', () => {
    test('should return wallets list for the current loginid', () => {
        const mock = mockStore({
            client: { accounts: { CRW909900: { token: '12345' } }, loginid: 'CRW909900' },
        });

        mockUseFetch.mockReturnValue({
            data: {
                authorize: {
                    account_list: [
                        {
                            // @ts-expect-error need to come up with a way to mock the return type of useFetch
                            account_category: 'wallet',
                            currency: 'USD',
                            is_virtual: 0,
                        },
                    ],
                },
            },
        });

        const wrapper = ({ children }: { children: JSX.Element }) => (
            <APIProvider>
                <StoreProvider store={mock}>{children}</StoreProvider>
            </APIProvider>
        );

        const { result } = renderHook(() => useAuthorize(), { wrapper });

        expect(result.current.data).toEqual({
            authorize: { account_list: [{ account_category: 'wallet', currency: 'USD', is_virtual: 0 }] },
        });
    });
});
