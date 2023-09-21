import * as React from 'react';
import { APIProvider } from '@deriv/api';
import { renderHook } from '@testing-library/react-hooks';
import useWalletAccountsList from '../useWalletAccountsList';

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
                            {
                                account_category: 'trading',
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
                            BTC: {
                                minimum_withdrawal: 0.00034286,
                            },
                            ETH: {
                                minimum_withdrawal: 0.02728729,
                            },
                            LTC: {
                                minimum_withdrawal: 0.06032091,
                            },
                            USD: {},
                            USDC: {
                                minimum_withdrawal: 50,
                            },
                            UST: {
                                minimum_withdrawal: 24.99,
                            },
                            eUSDT: {
                                minimum_withdrawal: 50.05,
                            },
                        },
                    },
                },
            };
        }

        return undefined;
    }),
}));

describe('useWalletAccountsList', () => {
    test('should return list of 5 accounts for the current account', () => {
        const wrapper = ({ children }: { children: JSX.Element }) => <APIProvider>{children}</APIProvider>;

        const { result } = renderHook(() => useWalletAccountsList(), { wrapper });

        expect(result.current.data?.every(wallet => wallet.account_category === 'wallet')).toEqual(true);
        expect(result.current.data?.length).toEqual(5);
    });

    test('should return sorted wallet list where virtual is the last and crypto is after fiat currency', () => {
        const wrapper = ({ children }: { children: JSX.Element }) => <APIProvider>{children}</APIProvider>;

        const { result } = renderHook(() => useWalletAccountsList(), { wrapper });

        expect(result.current.data?.map(wallet => wallet.currency)).toEqual(['AUD', 'BTC', 'ETH', 'UST', 'USD']);
    });
});
