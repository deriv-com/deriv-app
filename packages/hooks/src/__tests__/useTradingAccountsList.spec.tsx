import * as React from 'react';
import { APIProvider } from '@deriv/api';
import { StoreProvider, mockStore } from '@deriv/stores';
import { renderHook } from '@testing-library/react-hooks';
import useTradingAccountsList from '../useTradingAccountsList';

jest.mock('@deriv/api', () => ({
    ...jest.requireActual('@deriv/api'),
    useFetch: jest.fn((name: string) => {
        if (name === 'authorize') {
            return {
                data: {
                    authorize: {
                        account_list: [
                            {
                                account_category: 'trading',
                                currency: 'USD',
                                is_virtual: 1,
                                loginid: 'CR1001',
                            },
                            {
                                account_category: 'trading',
                                currency: 'USD',
                                is_virtual: 0,
                                loginid: 'CR1002',
                            },

                            {
                                account_category: 'trading',
                                currency: 'UST',
                                is_virtual: 0,
                                loginid: 'CR1003',
                            },
                            {
                                account_category: 'trading',
                                currency: 'BTC',
                                is_virtual: 0,
                                loginid: 'CR1004',
                            },
                            {
                                account_category: 'wallet',
                                currency: 'USD',
                                is_virtual: 0,
                                loginid: 'CRW1001',
                            },
                            {
                                account_category: 'wallet',
                                currency: 'BTC',
                                is_virtual: 0,
                                loginid: 'CRW1002',
                            },
                        ],
                    },
                },
            };
        } else if (name === 'balance') {
            return {
                data: {
                    balance: {
                        accounts: {
                            CR1001: {
                                balance: 10000,
                            },
                            CR1002: {
                                balance: 10,
                            },
                            CR1003: {
                                balance: 179,
                            },
                            CR1004: {
                                balance: 15,
                            },
                            CRW1001: {
                                balance: 679,
                            },
                            CRW1002: {
                                balance: 2.34,
                            },
                        },
                    },
                },
            };
        }

        return undefined;
    }),
}));

const createWrapper = (mock: ReturnType<typeof mockStore>) => {
    const wrapper = ({ children }: { children: JSX.Element }) => (
        <APIProvider>
            <StoreProvider store={mock}>{children}</StoreProvider>
        </APIProvider>
    );

    return wrapper;
};

describe('useTradingAccountsList', () => {
    test('should return trading accounts list for the current loginid', () => {
        const mock = mockStore({ client: { accounts: { CR1001: { token: '12345' } }, loginid: 'CR1001' } });

        const { result } = renderHook(() => useTradingAccountsList(), { wrapper: createWrapper(mock) });

        expect(result.current.data?.every(account => account.account_category === 'trading')).toEqual(true);
        expect(result.current.data?.length).toEqual(4);
        expect(result.current.data?.find(account => account.loginid === 'CR1003')?.balance).toEqual(179);
    });

    test('should return correct balance', () => {
        const mock = mockStore({ client: { accounts: { CR1001: { token: '12345' } }, loginid: 'CR1001' } });

        const { result } = renderHook(() => useTradingAccountsList(), { wrapper: createWrapper(mock) });

        expect(result.current.data?.find(account => account.loginid === 'CR1003')?.balance).toEqual(179);
    });
});
