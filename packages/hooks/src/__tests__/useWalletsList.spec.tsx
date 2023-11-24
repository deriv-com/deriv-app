import * as React from 'react';
import { APIProvider, useFetch } from '@deriv/api';
import { StoreProvider, mockStore } from '@deriv/stores';
import { renderHook } from '@testing-library/react-hooks';
import useWalletsList from '../useWalletsList';

const mockUseFetch = useFetch as jest.MockedFunction<typeof useFetch<'authorize'>>;

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
                                is_virtual: 1,
                            },
                            {
                                account_category: 'wallet',
                                currency: 'UST',
                                is_virtual: 0,
                            },
                            {
                                account_category: 'wallet',
                                currency: 'BTC',
                                is_virtual: 0,
                            },
                            {
                                account_category: 'wallet',
                                currency: 'AUD',
                                is_virtual: 0,
                            },
                            {
                                account_category: 'wallet',
                                currency: 'ETH',
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
                                balance: 0,
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
                            AUD: { type: 'fiat' },
                            BTC: { type: 'crypto' },
                            ETH: { type: 'crypto' },
                            UST: { type: 'crypto' },
                            USD: { type: 'fiat' },
                        },
                    },
                },
            };
        } else if (name === 'crypto_config') {
            return {
                data: {
                    crypto_config: {
                        currencies_config: {
                            BTC: {},
                        },
                    },
                },
            };
        }

        return undefined;
    }),
}));

describe('useWalletsList', () => {
    const wrapper = (mock: ReturnType<typeof mockStore>) => {
        const Component = ({ children }: { children: JSX.Element }) => (
            <APIProvider>
                <StoreProvider store={mock}>{children}</StoreProvider>
            </APIProvider>
        );
        return Component;
    };

    test('should return wallets list for the current loginid', () => {
        const mock = mockStore({ client: { accounts: { CRW909900: { token: '12345' } }, loginid: 'CRW909900' } });

        const { result } = renderHook(() => useWalletsList(), { wrapper: wrapper(mock) });

        expect(result.current.data?.every(wallet => wallet.account_category === 'wallet')).toEqual(true);
    });

    test('should return sorted wallet list where virtual is the last and crypto is after fiat currency', () => {
        const mock = mockStore({ client: { accounts: { CRW909900: { token: '12345' } }, loginid: 'CRW909900' } });

        const { result } = renderHook(() => useWalletsList(), { wrapper: wrapper(mock) });

        expect(result.current.data?.map(wallet => wallet.currency)).toEqual(['AUD', 'BTC', 'ETH', 'UST', 'USD']);
    });

    test('should return has_wallet equals to true if the client has at least one wallet', () => {
        const mock = mockStore({ client: { accounts: { CRW909900: { token: '12345' } }, loginid: 'CRW909900' } });

        const { result } = renderHook(() => useWalletsList(), { wrapper: wrapper(mock) });

        expect(result.current.has_wallet).toEqual(true);
    });

    test("should return has_wallet equals to false if the client doesn't have any wallet", () => {
        const mock = mockStore({ client: { accounts: { CR123456: { token: '12345' } }, loginid: 'CR123456' } });

        // @ts-expect-error need to come up with a way to mock the return type of useFetch
        mockUseFetch.mockReturnValue({
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

        const { result } = renderHook(() => useWalletsList(), { wrapper: wrapper(mock) });

        expect(result.current.has_wallet).toEqual(false);
    });
});
