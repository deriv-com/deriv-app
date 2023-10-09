import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { APIProvider, useFetch } from '@deriv/api';
import { mockStore, StoreProvider } from '@deriv/stores';
import WalletCardsCarousel from '..';

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
                                loginid: 'CRW10001',
                            },
                            {
                                account_category: 'trading',
                                currency: 'USD',
                                is_virtual: 0,
                                loginid: 'CRW10002',
                            },
                            {
                                account_category: 'wallet',
                                currency: 'UST',
                                is_virtual: 0,
                                loginid: 'CRW10003',
                            },
                            {
                                account_category: 'wallet',
                                currency: 'BTC',
                                is_virtual: 1,
                                loginid: 'VRW10001',
                            },
                            {
                                account_category: 'wallet',
                                currency: 'AUD',
                                is_virtual: 0,
                                loginid: 'CRW10004',
                            },
                            {
                                account_category: 'wallet',
                                currency: 'ETH',
                                is_virtual: 0,
                                loginid: 'CRW10005',
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

jest.mock('./../cards-slider-swiper', () => jest.fn(() => <div>slider</div>));
const mockUseFetch = useFetch as jest.MockedFunction<typeof useFetch<'authorize'>>;

describe('<WalletCardsCarousel />', () => {
    const wrapper = (mock: ReturnType<typeof mockStore>) => {
        const Component = ({ children }: { children: JSX.Element }) => (
            <APIProvider>
                <StoreProvider store={mock}>{children}</StoreProvider>
            </APIProvider>
        );
        return Component;
    };
    it('Should render slider', () => {
        const mock = mockStore({ client: { accounts: { CRW909900: { token: '12345' } }, loginid: 'CRW909900' } });

        render(<WalletCardsCarousel />, { wrapper: wrapper(mock) });
        const slider = screen.queryByText('slider');

        expect(slider).toBeInTheDocument();
    });

    it('Should render buttons for REAL', () => {
        const mock = mockStore({ client: { accounts: { CRW909900: { token: '12345' } }, loginid: 'CRW909900' } });

        render(<WalletCardsCarousel />, { wrapper: wrapper(mock) });

        const btn1 = screen.getByRole('button', { name: /Deposit/i });
        const btn2 = screen.getByRole('button', { name: /Withdraw/i });
        const btn3 = screen.getByRole('button', { name: /Transfer/i });
        const btn4 = screen.getByRole('button', { name: /Transactions/i });

        expect(btn1).toBeInTheDocument();
        expect(btn2).toBeInTheDocument();
        expect(btn3).toBeInTheDocument();
        expect(btn4).toBeInTheDocument();
    });

    it('Should render buttons for DEMO', () => {
        const mock = mockStore({ client: { accounts: { VRW10001: { token: '12345' } }, loginid: 'VRW10001' } });

        mockUseFetch.mockReturnValue({
            data: {
                authorize: {
                    account_list: [
                        {
                            account_category: 'wallet',
                            account_type: 'doughflow',
                            currency: 'USD',
                            is_virtual: 1,
                            loginid: 'VRW10001',
                        },
                    ],
                    loginid: 'VRW10001',
                },
            },
        } as unknown as ReturnType<typeof mockUseFetch>);

        render(<WalletCardsCarousel />, { wrapper: wrapper(mock) });

        const btn1 = screen.getByRole('button', { name: /Transfer/i });
        const btn2 = screen.getByRole('button', { name: /Transactions/i });
        const btn3 = screen.getByRole('button', { name: /Reset balance/i });

        expect(btn1).toBeInTheDocument();
        expect(btn2).toBeInTheDocument();
        expect(btn3).toBeInTheDocument();
    });
});
