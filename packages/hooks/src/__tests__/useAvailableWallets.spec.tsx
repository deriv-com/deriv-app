import React from 'react';
import { APIProvider } from '@deriv/api';
import useAvailableWallets from '../useAvailableWallets';
import { renderHook } from '@testing-library/react-hooks';

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
        } else if (name === 'website_status') {
            return {
                data: {
                    website_status: {
                        currencies_config: {
                            AUD: { type: 'fiat', is_crypto: false },
                            BTC: { type: 'crypto', is_crypto: true },
                            ETH: { type: 'crypto', is_crypto: true },
                            UST: { type: 'crypto', is_crypto: true },
                            USD: { type: 'fiat', is_crypto: false },
                            LTC: { type: 'crypto', is_crypto: true },
                        },
                    },
                },
            };
        }

        return { data: undefined };
    }),
}));

describe('useAvailableWallets', () => {
    it('should return available wallets', () => {
        const wrapper = ({ children }: { children: JSX.Element }) => <APIProvider>{children}</APIProvider>;

        const { result } = renderHook(() => useAvailableWallets(), { wrapper });

        const expected = ['AUD', 'EUR', 'BTC', 'ETH', 'LTC', 'USD'].map(currency => ({
            currency,
            is_added: currency === 'USD',
            landing_company_name: 'svg',
            gradient_card_class: `wallet-card__${currency.toLowerCase()}-bg`,
        }));

        expect(result.current?.data).toEqual(expected);
    });

    it('should not return unavailable wallets', () => {
        const wrapper = ({ children }: { children: JSX.Element }) => <APIProvider>{children}</APIProvider>;

        const { result } = renderHook(() => useAvailableWallets(), { wrapper });

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
