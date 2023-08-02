import * as React from 'react';
import { APIProvider, useFetch } from '@deriv/api';
import { StoreProvider, mockStore } from '@deriv/stores';
import { renderHook } from '@testing-library/react-hooks';
import useHasWallet from '../useHasWallet';

jest.mock('@deriv/api', () => ({
    ...jest.requireActual('@deriv/api'),
    useFetch: jest.fn((name: string) => {
        if (name === 'authorize') {
            return {
                data: {
                    authorize: {
                        account_list: [
                            {
                                account_category: 'wallet',
                                currency: 'USD',
                                is_virtual: 0,
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
                            CRW909900: {
                                balance: 1000,
                            },
                        },
                    },
                },
            };
        } else if (name === 'website_status') {
            return {
                data: {
                    website_status: {
                        currencies_config: {
                            USD: { type: 'fiat' },
                        },
                    },
                },
            };
        }

        return undefined;
    }),
}));

describe('useHasWallet', () => {
    test('should return has_wallet equals to true if the client has at least one wallet', () => {
        const mock = mockStore({ client: { accounts: { CRW909900: { token: '12345' } }, loginid: 'CRW909900' } });

        const wrapper = ({ children }: { children: JSX.Element }) => (
            <APIProvider>
                <StoreProvider store={mock}>{children}</StoreProvider>
            </APIProvider>
        );

        const { result } = renderHook(() => useHasWallet(), { wrapper });

        const has_wallet = result.current;

        expect(has_wallet).toEqual(true);
    });

    test("should return has_wallet equals to false if the client doesn't have any wallet", () => {
        const mock = mockStore({ client: { accounts: { CR123456: { token: '12345' } }, loginid: 'CR123456' } });

        (useFetch as jest.Mock).mockReturnValue({
            data: {
                authorize: {
                    account_list: [
                        {
                            account_category: 'trading',
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

        const { result } = renderHook(() => useHasWallet(), { wrapper });

        const has_wallet = result.current;

        expect(has_wallet).toEqual(false);
    });
});
