import React from 'react';
import { screen, render } from '@testing-library/react';
import { APIProvider } from '@deriv/api';
import { StoreProvider, mockStore } from '@deriv/stores';
import AddMoreWallets from '../add-more-wallets';

jest.mock('../wallet-add-card', () => {
    const AddWalletCard = () => <div>AddWalletCard</div>;
    return AddWalletCard;
});

jest.mock('../carousel-container', () => {
    const CarouselContainer = ({ children }: React.PropsWithChildren) => (
        <div data-testid='dt_carousel_container'>{children}</div>
    );
    return CarouselContainer;
});

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
                                currencies: ['BTC', 'ETH'],
                            },
                            doughflow: {
                                currencies: ['USD', 'EUR'],
                            },
                        },
                    },
                },
            };
        }

        return { data: undefined };
    }),
}));

describe('AddMoreWallets', () => {
    const wrapper = (mock: ReturnType<typeof mockStore>) => {
        const Component = ({ children }: React.PropsWithChildren) => {
            return (
                <APIProvider>
                    <StoreProvider store={mock}>{children}</StoreProvider>
                </APIProvider>
            );
        };
        return Component;
    };

    it('should render the component without errors', () => {
        const mock = mockStore({
            client: {
                loginid: 'CRW909900',
                accounts: {
                    CRW909900: {
                        token: '12345',
                    },
                },
                is_crypto: (currency: string) => currency === 'BTC',
            },
        });

        const { container } = render(<AddMoreWallets />, { wrapper: wrapper(mock) });
        expect(container).toBeInTheDocument();
    });

    it('should render the title correctly', () => {
        const mock = mockStore({
            client: {
                loginid: 'CRW909900',
                accounts: {
                    CRW909900: {
                        token: '12345',
                    },
                },
                is_crypto: (currency: string) => currency === 'BTC',
            },
        });

        render(<AddMoreWallets />, { wrapper: wrapper(mock) });
        expect(screen.getByText('Add more Wallets')).toBeInTheDocument();
    });

    it('should render the carousel', () => {
        const mock = mockStore({
            client: {
                loginid: 'CRW909900',
                accounts: {
                    CRW909900: {
                        token: '12345',
                    },
                },
                is_crypto: (currency: string) => currency === 'BTC',
            },
        });

        render(<AddMoreWallets />, { wrapper: wrapper(mock) });
        expect(screen.getByTestId('dt_carousel_container')).toBeInTheDocument();
    });

    it('should render the wallet add card', () => {
        const mock = mockStore({
            client: {
                loginid: 'CRW909900',
                accounts: {
                    CRW909900: {
                        token: '12345',
                    },
                },
                is_crypto: (currency: string) => currency === 'BTC',
            },
        });

        render(<AddMoreWallets />, { wrapper: wrapper(mock) });
        const wallet_cards = screen.getAllByText(/AddWalletCard/i);
        expect(wallet_cards).toHaveLength(4);
    });
});
