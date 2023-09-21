import * as React from 'react';
import { APIProvider } from '@deriv/api';
import { StoreProvider, mockStore } from '@deriv/stores';
import { renderHook } from '@testing-library/react-hooks';
import useLinkedWalletsAccounts from '../useLinkedWalletsAccounts';

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
                                linked_to: [
                                    { loginid: 'CR123', platform: 'mt5' },
                                    { loginid: 'CR456', platform: 'dtrade' },
                                ],
                            },
                            {
                                account_category: 'wallet',
                                currency: 'UST',
                                is_virtual: 0,
                                linked_to: [{ loginid: 'CR777', platform: 'derivez' }],
                            },
                            {
                                account_category: 'wallet',
                                currency: 'BTC',
                                is_virtual: 0,
                                linked_to: [],
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

describe('useLinkedWalletsAccounts', () => {
    test('should return object with linked accounts for all wallets', () => {
        const mock = mockStore({ client: { accounts: { CRW909900: { token: '12345' } }, loginid: 'CRW909900' } });

        const wrapper = ({ children }: { children: JSX.Element }) => (
            <APIProvider>
                <StoreProvider store={mock}>{children}</StoreProvider>
            </APIProvider>
        );

        const { result } = renderHook(() => useLinkedWalletsAccounts(), { wrapper });

        expect(result.current.data).toMatchObject({
            derivez: [{ loginid: 'CR777', platform: 'derivez' }],
            dtrade: [{ loginid: 'CR456', platform: 'dtrade' }],
            dwallet: [],
            dxtrade: [],
            mt5: [{ loginid: 'CR123', platform: 'mt5' }],
        });
    });
});
