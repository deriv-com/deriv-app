import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { createBrowserHistory } from 'history';
import { Router } from 'react-router';
import { getCurrencyName, isMobile } from '@deriv/shared';
import CryptoDeposit from '../crypto-deposit';
import { mockStore } from '@deriv/stores';
import CashierProviders from '../../../../cashier-providers';

jest.mock('@deriv/components', () => ({
    ...jest.requireActual('@deriv/components'),
    Loading: () => <div>Loading</div>,
}));

jest.mock('@deriv/shared', () => ({
    ...jest.requireActual('@deriv/shared'),
    getCurrencyName: jest.fn(),
    isMobile: jest.fn(() => false),
}));

jest.mock('qrcode.react', () => {
    const QrCode = () => <div>QRCode</div>;
    return QrCode;
});
jest.mock('Components/recent-transaction', () => {
    const RecentTransactions = () => <div>RecentTransactions</div>;
    return RecentTransactions;
});

jest.mock('@deriv/api', () => {
    return {
        ...jest.requireActual('@deriv/api'),
        useFetch: jest.fn(() => ({
            data: {
                crypto_config: {
                    currencies_config: {
                        tUSDT: {
                            minimum_deposit: 2,
                            minimum_withdrawal: 4.54,
                        },
                    },
                },
            },
            isLoading: false,
            isSuccess: true,
        })),
    };
});

describe('<CryptoDeposit />', () => {
    let history: ReturnType<typeof createBrowserHistory>;
    const renderWithRouter = (component: JSX.Element, mock_root_store: ReturnType<typeof mockStore>) => {
        history = createBrowserHistory();
        return render(<Router history={history}>{component}</Router>, {
            wrapper: ({ children }) => <CashierProviders store={mock_root_store}>{children}</CashierProviders>,
        });
    };

    it('should show loader', () => {
        const mock_root_store = mockStore({
            client: {
                currency: 'BTC',
            },
            modules: {
                cashier: {
                    onramp: {
                        is_deposit_address_loading: true,
                        api_error: '',
                        deposit_address: 'tb1ql7w62elx9ucw4pj5lgw4l028hmuw80sndtntxt',
                        pollApiForDepositAddress: jest.fn(),
                    },
                    transaction_history: {
                        crypto_transactions: [{}],
                        onMount: jest.fn(),
                    },
                    general_store: {
                        setIsDeposit: jest.fn(),
                    },
                },
            },
        });

        renderWithRouter(<CryptoDeposit />, mock_root_store);

        expect(screen.getByText('Loading')).toBeInTheDocument();
    });

    it('should show proper breadcrumbs', () => {
        const mock_root_store = mockStore({
            client: {
                currency: 'BTC',
            },
            modules: {
                cashier: {
                    onramp: {
                        is_deposit_address_loading: false,
                        api_error: '',
                        deposit_address: 'tb1ql7w62elx9ucw4pj5lgw4l028hmuw80sndtntxt',
                        pollApiForDepositAddress: jest.fn(),
                    },
                    transaction_history: {
                        crypto_transactions: [{}],
                        onMount: jest.fn(),
                    },
                    general_store: {
                        setIsDeposit: jest.fn(),
                    },
                },
            },
        });

        renderWithRouter(<CryptoDeposit />, mock_root_store);

        expect(screen.getByText(/cashier/i)).toBeInTheDocument();
        expect(screen.getByText(/deposit cryptocurrencies/i)).toBeInTheDocument();
    });

    it('should trigger setIsDeposit callback when the user clicks on Cashier breadcrumb', () => {
        const mock_root_store = mockStore({
            client: {
                currency: 'BTC',
            },
            modules: {
                cashier: {
                    onramp: {
                        is_deposit_address_loading: false,
                        api_error: '',
                        deposit_address: 'tb1ql7w62elx9ucw4pj5lgw4l028hmuw80sndtntxt',
                        pollApiForDepositAddress: jest.fn(),
                    },
                    transaction_history: {
                        crypto_transactions: [{}],
                        onMount: jest.fn(),
                    },
                    general_store: {
                        setIsDeposit: jest.fn(),
                    },
                },
            },
        });

        renderWithRouter(<CryptoDeposit />, mock_root_store);

        const el_breadcrumb_cashier = screen.queryByText(/cashier/i);

        if (el_breadcrumb_cashier) {
            fireEvent.click(el_breadcrumb_cashier);
            expect(mock_root_store.modules?.cashier.general_store.setIsDeposit).toHaveBeenCalledWith(false);
        }
    });

    it('should show proper error message and button', () => {
        const mock_root_store = mockStore({
            client: {
                currency: 'BTC',
            },
            modules: {
                cashier: {
                    onramp: {
                        is_deposit_address_loading: false,
                        api_error: 'api_error',
                        deposit_address: 'tb1ql7w62elx9ucw4pj5lgw4l028hmuw80sndtntxt',
                        pollApiForDepositAddress: jest.fn(),
                    },
                    transaction_history: {
                        crypto_transactions: [{}],
                        onMount: jest.fn(),
                    },
                    general_store: {
                        setIsDeposit: jest.fn(),
                    },
                },
            },
        });

        renderWithRouter(<CryptoDeposit />, mock_root_store);

        expect(
            screen.getByText(
                "Unfortunately, we couldn't get the address since our server was down. Please click Refresh to reload the address or try again later."
            )
        ).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Refresh' })).toBeInTheDocument();
    });

    it('should trigger onClick callback when the user clicks "Refresh" button', () => {
        const mock_root_store = mockStore({
            client: {
                currency: 'BTC',
            },
            modules: {
                cashier: {
                    onramp: {
                        is_deposit_address_loading: false,
                        api_error: 'api_error',
                        deposit_address: 'tb1ql7w62elx9ucw4pj5lgw4l028hmuw80sndtntxt',
                        pollApiForDepositAddress: jest.fn(),
                    },
                    transaction_history: {
                        crypto_transactions: [{}],
                        onMount: jest.fn(),
                    },
                    general_store: {
                        setIsDeposit: jest.fn(),
                    },
                },
            },
        });

        renderWithRouter(<CryptoDeposit />, mock_root_store);

        const refresh_btn = screen.getByRole('button', { name: 'Refresh' });
        fireEvent.click(refresh_btn);

        expect(mock_root_store.modules.cashier.onramp.pollApiForDepositAddress).toHaveBeenCalledTimes(2);
    });

    it('should show proper messages for BTC cryptocurrency', () => {
        const mock_root_store = mockStore({
            client: {
                currency: 'BTC',
            },
            modules: {
                cashier: {
                    onramp: {
                        is_deposit_address_loading: false,
                        api_error: '',
                        deposit_address: 'tb1ql7w62elx9ucw4pj5lgw4l028hmuw80sndtntxt',
                        pollApiForDepositAddress: jest.fn(),
                    },
                    transaction_history: {
                        crypto_transactions: [{}],
                        onMount: jest.fn(),
                    },
                    general_store: {
                        setIsDeposit: jest.fn(),
                    },
                },
            },
        });

        (getCurrencyName as jest.Mock).mockReturnValueOnce('Bitcoin');
        renderWithRouter(<CryptoDeposit />, mock_root_store);

        expect(screen.getByText('Send only Bitcoin (BTC) to this address.')).toBeInTheDocument();
        expect(
            screen.getByText("Do not send any other currency to the following address. Otherwise, you'll lose funds.")
        ).toBeInTheDocument();
        expect(screen.getByText('tb1ql7w62elx9ucw4pj5lgw4l028hmuw80sndtntxt')).toBeInTheDocument();
        expect(screen.getByText('QRCode')).toBeInTheDocument();
        expect(screen.getByText('Looking for a way to buy cryptocurrency?')).toBeInTheDocument();
        expect(
            screen.getByText('Use our fiat onramp services to buy and deposit cryptocurrency into your Deriv account.')
        ).toBeInTheDocument();
        expect(screen.getByRole('link', { name: 'Try our Fiat onramp' })).toBeInTheDocument();
    });

    it('should show proper messages for ETH cryptocurrency', () => {
        const mock_root_store = mockStore({
            client: {
                currency: 'ETH',
            },
            modules: {
                cashier: {
                    onramp: {
                        is_deposit_address_loading: false,
                        api_error: '',
                        deposit_address: 'tb1ql7w62elx9ucw4pj5lgw4l028hmuw80sndtntxt',
                        pollApiForDepositAddress: jest.fn(),
                    },
                    transaction_history: {
                        crypto_transactions: [{}],
                        onMount: jest.fn(),
                    },
                    general_store: {
                        setIsDeposit: jest.fn(),
                    },
                },
            },
        });

        (getCurrencyName as jest.Mock).mockReturnValueOnce('Ethereum');
        renderWithRouter(<CryptoDeposit />, mock_root_store);

        expect(screen.getByText('Send only Ethereum (ETH) to this address.')).toBeInTheDocument();
        expect(
            screen.getByText('Please select the network from where your deposit will come from.')
        ).toBeInTheDocument();
        expect(screen.getByText('Choose an option')).toBeInTheDocument();
    });

    it('should show proper messages for selected options for ETH, USDC, eUSDT cryptocurrency', () => {
        const checkMessagesForOptions = (currency: string, token: string) => {
            const mock_root_store = mockStore({
                client: {
                    currency,
                },
                modules: {
                    cashier: {
                        onramp: {
                            is_deposit_address_loading: false,
                            api_error: '',
                            deposit_address: 'tb1ql7w62elx9ucw4pj5lgw4l028hmuw80sndtntxt',
                            pollApiForDepositAddress: jest.fn(),
                        },
                        transaction_history: {
                            crypto_transactions: [{}],
                            onMount: jest.fn(),
                        },
                        general_store: {
                            setIsDeposit: jest.fn(),
                        },
                    },
                },
            });

            const { rerender, unmount } = renderWithRouter(<CryptoDeposit />, mock_root_store);
            const rerenderAndOpenDropdownOptions = () => {
                rerender(
                    <Router history={history}>
                        <CryptoDeposit />
                    </Router>
                );
                const dropdown_display = screen.getByTestId('dti_dropdown_display');
                fireEvent.click(dropdown_display);
                return screen.getAllByTestId('dti_list_item');
            };

            rerenderAndOpenDropdownOptions().forEach(option => {
                if (option.textContent === 'Binance Smart Chain') {
                    fireEvent.click(option);
                    expect(
                        screen.getByText(
                            `We do not support Binance Smart Chain tokens to deposit, please use only Ethereum (${token}).`
                        )
                    ).toBeInTheDocument();
                    unmount();
                }
            });

            rerenderAndOpenDropdownOptions().forEach(option => {
                if (option.textContent === 'Polygon (Matic)') {
                    fireEvent.click(option);
                    expect(
                        screen.getByText(
                            `We do not support Polygon (Matic), to deposit please use only Ethereum (${token}).`
                        )
                    ).toBeInTheDocument();
                    unmount();
                }
            });

            rerenderAndOpenDropdownOptions().forEach(option => {
                if (option.textContent === 'Tron') {
                    fireEvent.click(option);
                    expect(
                        screen.getByText(`We do not support Tron, to deposit please use only Ethereum (${token}).`)
                    ).toBeInTheDocument();
                    unmount();
                }
            });

            rerenderAndOpenDropdownOptions().forEach(option => {
                if (option.textContent === 'Ethereum (ERC20)') {
                    fireEvent.click(option);
                    if (currency === 'ETH') {
                        expect(
                            screen.getByText(
                                `This is an Ethereum (${token}) only address, please do not use ${
                                    token === 'ERC20' ? 'ETH' : 'ERC20 token'
                                }.`
                            )
                        ).toBeInTheDocument();
                        unmount();
                    } else if (['USDC', 'eUSDT'].includes(currency)) {
                        expect(
                            screen.getByText(
                                "Do not send any other currency to the following address. Otherwise, you'll lose funds."
                            )
                        ).toBeInTheDocument();
                        expect(screen.getByText('QRCode')).toBeInTheDocument();
                        expect(screen.getByText('tb1ql7w62elx9ucw4pj5lgw4l028hmuw80sndtntxt')).toBeInTheDocument();
                        unmount();
                    }
                }
            });

            rerenderAndOpenDropdownOptions().forEach(option => {
                if (option.textContent === 'Ethereum (ETH)') {
                    fireEvent.click(option);
                    if (currency === 'ETH') {
                        expect(
                            screen.getByText(
                                "Do not send any other currency to the following address. Otherwise, you'll lose funds."
                            )
                        ).toBeInTheDocument();
                        expect(screen.getByText('QRCode')).toBeInTheDocument();
                        expect(screen.getByText('tb1ql7w62elx9ucw4pj5lgw4l028hmuw80sndtntxt')).toBeInTheDocument();
                        unmount();
                    } else if (['USDC', 'eUSDT'].includes(currency)) {
                        expect(
                            screen.getByText(
                                `This is an Ethereum (${token}) only address, please do not use ${
                                    token === 'ERC20' ? 'ETH' : 'ERC20 token'
                                }.`
                            )
                        ).toBeInTheDocument();
                        unmount();
                    }
                }
            });
        };

        checkMessagesForOptions('ETH', 'ETH');
        checkMessagesForOptions('USDC', 'ERC20');
        checkMessagesForOptions('eUSDT', 'ERC20');
    });

    it('should show "RecentTransactions" in Mobile mode', () => {
        const mock_root_store = mockStore({
            client: {
                currency: 'BTC',
            },
            modules: {
                cashier: {
                    onramp: {
                        is_deposit_address_loading: false,
                        api_error: '',
                        deposit_address: 'tb1ql7w62elx9ucw4pj5lgw4l028hmuw80sndtntxt',
                        pollApiForDepositAddress: jest.fn(),
                    },
                    transaction_history: {
                        crypto_transactions: [{}],
                        onMount: jest.fn(),
                    },
                    general_store: {
                        setIsDeposit: jest.fn(),
                    },
                },
            },
        });

        (isMobile as jest.Mock).mockReturnValue(true);
        render(
            <Router history={history}>
                <CryptoDeposit />
            </Router>,
            {
                wrapper: ({ children }) => <CashierProviders store={mock_root_store}>{children}</CashierProviders>,
            }
        );

        expect(screen.getByText('RecentTransactions')).toBeInTheDocument();
    });

    it('should show AlertBanner for minimum deposit when third-party payment processor is used (CoinsPaid)', () => {
        const minimum_deposit = 2;
        const currency = 'tUSDT';
        const mock = mockStore({
            client: {
                currency: 'tUSDT',
            },
            modules: {
                cashier: {
                    onramp: {
                        is_deposit_address_loading: false,
                        api_error: '',
                        deposit_address: 'tb1ql7w62elx9ucw4pj5lgw4l028hmuw80sndtntxt',
                        pollApiForDepositAddress: jest.fn(),
                    },
                    transaction_history: {
                        crypto_transactions: [{}],
                        onMount: jest.fn(),
                    },
                    general_store: {
                        setIsDeposit: jest.fn(),
                    },
                },
            },
        });

        const wrapper = ({ children }: { children: JSX.Element }) => {
            return (
                <Router history={history}>
                    <CashierProviders store={mock}>{children}</CashierProviders>;
                </Router>
            );
        };
        render(<CryptoDeposit />, { wrapper });
        expect(
            screen.getByText(
                `A minimum deposit value of ${minimum_deposit} ${currency} is required. Otherwise, the funds will be lost and cannot be recovered.`
            )
        ).toBeInTheDocument();
    });
});
