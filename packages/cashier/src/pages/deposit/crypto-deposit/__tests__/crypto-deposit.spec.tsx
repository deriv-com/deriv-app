import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { createBrowserHistory } from 'history';
import { Router } from 'react-router';
import { getCurrencyName, isMobile } from '@deriv/shared';
import { StoreProvider } from '@deriv/stores';
import CryptoDeposit from '../crypto-deposit';
import { TRootStore } from '../../../../types';

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

describe('<CryptoDeposit />', () => {
    let history: ReturnType<typeof createBrowserHistory>;
    const renderWithRouter = (component: JSX.Element, mockRootStore: TRootStore) => {
        history = createBrowserHistory();
        return render(<Router history={history}>{component}</Router>, {
            wrapper: ({ children }) => <StoreProvider store={mockRootStore}>{children}</StoreProvider>,
        });
    };

    it('should show loader', () => {
        const mockRootStore: DeepPartial<TRootStore> = {
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
        };

        renderWithRouter(<CryptoDeposit />, mockRootStore as TRootStore);

        expect(screen.getByText('Loading')).toBeInTheDocument();
    });

    it('should show proper error message and button', () => {
        const mockRootStore: DeepPartial<TRootStore> = {
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
        };

        renderWithRouter(<CryptoDeposit />, mockRootStore as TRootStore);

        expect(
            screen.getByText(
                "Unfortunately, we couldn't get the address since our server was down. Please click Refresh to reload the address or try again later."
            )
        ).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Refresh' })).toBeInTheDocument();
    });

    it('should trigger onClick callback when the user clicks "Refresh" button', () => {
        const mockRootStore: DeepPartial<TRootStore> = {
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
        };

        renderWithRouter(<CryptoDeposit />, mockRootStore as TRootStore);

        const refresh_btn = screen.getByRole('button', { name: 'Refresh' });
        fireEvent.click(refresh_btn);

        expect(mockRootStore.modules!.cashier!.onramp!.pollApiForDepositAddress).toHaveBeenCalledTimes(2);
    });

    it('should show proper messages for BTC cryptocurrency', () => {
        const mockRootStore: DeepPartial<TRootStore> = {
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
        };

        (getCurrencyName as jest.Mock).mockReturnValueOnce('Bitcoin');
        renderWithRouter(<CryptoDeposit />, mockRootStore as TRootStore);

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
        const mockRootStore: DeepPartial<TRootStore> = {
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
        };

        (getCurrencyName as jest.Mock).mockReturnValueOnce('Ethereum');
        renderWithRouter(<CryptoDeposit />, mockRootStore as TRootStore);

        expect(screen.getByText('Send only Ethereum (ETH) to this address.')).toBeInTheDocument();
        expect(
            screen.getByText('Please select the network from where your deposit will come from.')
        ).toBeInTheDocument();
        expect(screen.getByText('Choose an option')).toBeInTheDocument();
    });

    it('should show proper messages for selected options for ETH, USDC, eUSDT cryptocurrency', () => {
        const checkMessagesForOptions = (currency, token) => {
            const mockRootStore: DeepPartial<TRootStore> = {
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
            };

            const { rerender, unmount } = renderWithRouter(<CryptoDeposit />, mockRootStore as TRootStore);
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
        const mockRootStore: DeepPartial<TRootStore> = {
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
        };

        (isMobile as jest.Mock).mockReturnValue(true);
        render(
            <Router history={history}>
                <CryptoDeposit />
            </Router>,
            { wrapper: ({ children }) => <StoreProvider store={mockRootStore as TRootStore}>{children}</StoreProvider> }
        );

        expect(screen.getByText('RecentTransactions')).toBeInTheDocument();
    });
});
