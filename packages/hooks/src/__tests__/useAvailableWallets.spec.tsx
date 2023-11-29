import React from 'react';
import { APIProvider } from '@deriv/api';
import useAvailableWallets from '../useAvailableWallets';
import { renderHook } from '@testing-library/react-hooks';
import { StoreProvider, mockStore } from '@deriv/stores';

jest.mock('@deriv/api', () => ({
    ...jest.requireActual('@deriv/api'),
    useFetch: jest.fn((name: string) => {
        if (name === 'authorize') {
            return {
                data: {
                    authorize: {
                        account_list: [
                            { account_category: 'wallet', landing_company_name: 'svg', is_virtual: 0, currency: 'USD' },
                        ],
                        landing_company_name: 'svg',
                    },
                },
            };
        }

        if (name === 'get_account_types') {
            return {
                data: {
                    get_account_types: {
                        wallet: {
                            crypto: {
                                currencies: ['BTC', 'ETH', 'LTC'],
                            },
                            doughflow: {
                                currencies: ['USD', 'EUR', 'AUD'],
                            },
                        },
                    },
                },
            };
        }

        return { data: undefined };
    }),
}));

describe('useAvailableWallets', () => {
    const createWrapper = (mock: ReturnType<typeof mockStore>) => {
        const Component = ({ children }: { children: JSX.Element }) => (
            <APIProvider>
                <StoreProvider store={mock}>{children}</StoreProvider>
            </APIProvider>
        );
        return Component;
    };
    it('should return available wallets', () => {
        const mock = mockStore({
            client: {
                accounts: { CRW909900: { token: '12345', landing_company_name: 'svg' } },
                loginid: 'CRW909900',
                is_crypto: (currency: string) => ['BTC', 'ETH', 'LTC'].includes(currency),
            },
        });

        const { result } = renderHook(() => useAvailableWallets(), { wrapper: createWrapper(mock) });

        expect(result.current?.data).toEqual(
            ['AUD', 'EUR', 'BTC', 'ETH', 'LTC', 'USD'].map(currency => ({
                currency,
                is_added: currency === 'USD',
                landing_company_name: 'svg',
                gradient_card_class: `wallet-card__${currency.toLowerCase()}-bg`,
            }))
        );
    });

    it('should not return unavailable wallets', () => {
        const mock = mockStore({
            client: {
                accounts: { CRW909900: { token: '12345', landing_company_name: 'svg' } },
                loginid: 'CRW909900',
                is_crypto: (currency: string) => ['BTC', 'ETH', 'LTC'].includes(currency),
            },
        });

        const { result } = renderHook(() => useAvailableWallets(), { wrapper: createWrapper(mock) });

        expect(result.current?.data).not.toEqual([
            {
                currency: 'GBP',
                is_added: false,
                landing_company_name: 'svg',
                gradient_card_class: 'wallet-card__gbp-bg',
            },
        ]);
    });
});
