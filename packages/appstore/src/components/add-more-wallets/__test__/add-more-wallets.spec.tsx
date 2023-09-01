import React from 'react';
import { screen, render } from '@testing-library/react';
import AddMoreWallets from '../add-more-wallets';
import { APIProvider } from '@deriv/api';
import { StoreProvider, mockStore } from '@deriv/stores';

jest.mock('../wallet-add-card', () => {
    const AddWalletCard = () => <div>AddWalletCard</div>;
    return AddWalletCard;
});

jest.mock('../carousel-container', () => {
    const CarouselContainer = ({ children }: { children: React.ReactNode }) => (
        <div data-testid='dt-carousel-container'>{children}</div>
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

        const wrapper = ({ children }: { children: JSX.Element }) => (
            <APIProvider>
                <StoreProvider store={mock}>{children}</StoreProvider>
            </APIProvider>
        );

        const { container } = render(<AddMoreWallets />, { wrapper });
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

        const wrapper = ({ children }: { children: JSX.Element }) => (
            <APIProvider>
                <StoreProvider store={mock}>{children}</StoreProvider>
            </APIProvider>
        );

        render(<AddMoreWallets />, { wrapper });
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

        const wrapper = ({ children }: { children: JSX.Element }) => (
            <APIProvider>
                <StoreProvider store={mock}>{children}</StoreProvider>
            </APIProvider>
        );

        render(<AddMoreWallets />, { wrapper });
        expect(screen.getByTestId('dt-carousel-container')).toBeInTheDocument();
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

        const wrapper = ({ children }: { children: JSX.Element }) => (
            <APIProvider>
                <StoreProvider store={mock}>{children}</StoreProvider>
            </APIProvider>
        );

        render(<AddMoreWallets />, { wrapper });
        const wallet_cards = screen.getAllByText(/AddWalletCard/i);
        expect(wallet_cards).toHaveLength(4);
    });
});
