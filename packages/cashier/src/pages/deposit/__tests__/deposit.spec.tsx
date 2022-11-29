import React from 'react';
import { render, screen } from '@testing-library/react';
import { StoreProvider } from '@deriv/stores';
import { DeepPartial } from '@deriv/stores/types';
import Deposit from '../deposit';
import { TRootStore } from '../../../types';

jest.mock('@deriv/components', () => ({
    ...jest.requireActual('@deriv/components'),
    Loading: () => <div>Loading</div>,
}));
jest.mock('Components/cashier-container/virtual', () => {
    const CashierContainerVirtual = () => <div>Virtual</div>;
    return CashierContainerVirtual;
});
jest.mock('Components/cashier-locked', () => {
    const CashierLocked = () => <div>CashierLocked</div>;
    return CashierLocked;
});
jest.mock('Components/funds-protection', () => {
    const FundsProtection = () => <div>FundsProtection</div>;
    return FundsProtection;
});
jest.mock('Components/crypto-transactions-history', () => {
    const CryptoTransactionsHistory = () => <div>CryptoTransactionsHistory</div>;
    return CryptoTransactionsHistory;
});
jest.mock('Components/error', () => {
    const Error = () => <div>Error</div>;
    return Error;
});
jest.mock('../crypto-deposit', () => {
    const CryptoDeposit = () => <div>CryptoDeposit</div>;
    return CryptoDeposit;
});
jest.mock('Components/cashier-container/real', () => {
    const CashierContainerReal = () => <div>Real</div>;
    return CashierContainerReal;
});
jest.mock('Components/cashier-onboarding/cashier-onboarding', () => {
    const CashierOnboarding = () => <div>CashierOnboarding</div>;
    return CashierOnboarding;
});
jest.mock('../deposit-locked', () => {
    const DepositLocked = () => <div>DepositLocked</div>;
    return DepositLocked;
});

describe('<Deposit />', () => {
    it('should render <Loading /> component', () => {
        const mockRootStore: DeepPartial<TRootStore> = {
            client: {
                currency: 'USD',
                can_change_fiat_currency: false,
                current_currency_type: 'fiat',
                is_eu: false,
                is_switching: true,
                is_virtual: false,
            },
            modules: {
                cashier: {
                    iframe: {
                        iframe_url: '',
                    },
                    transaction_history: {
                        is_crypto_transactions_visible: false,
                        onMount: jest.fn(),
                    },
                    deposit: {
                        error: { is_ask_uk_funds_protection: false, message: '', setErrorMessage: jest.fn() },
                        is_deposit_locked: false,
                        onMountDeposit: jest.fn(),
                    },
                    general_store: {
                        is_cashier_locked: false,

                        is_deposit: false,
                        is_loading: false,
                        is_system_maintenance: false,
                        setActiveTab: jest.fn(),
                        setIsDeposit: jest.fn(),
                    },
                },
            },
        };

        const { rerender } = render(<Deposit setSideNotes={jest.fn()} />, {
            wrapper: ({ children }) => <StoreProvider store={mockRootStore}>{children}</StoreProvider>,
        });

        expect(screen.getByText('Loading')).toBeInTheDocument();

        rerender(<Deposit setSideNotes={jest.fn()} is_switching={false} is_loading iframe_url='' />);

        expect(screen.getByText('Loading')).toBeInTheDocument();
    });

    it('should render <Virtual /> component', () => {
        const mockRootStore: DeepPartial<TRootStore> = {
            client: {
                currency: 'USD',
                can_change_fiat_currency: false,
                current_currency_type: 'fiat',
                is_eu: false,
                is_switching: false,
                is_virtual: true,
            },
            modules: {
                cashier: {
                    iframe: {},
                    transaction_history: {
                        is_crypto_transactions_visible: false,
                        onMount: jest.fn(),
                    },
                    deposit: {
                        error: { is_ask_uk_funds_protection: false, message: '', setErrorMessage: jest.fn() },
                        is_deposit_locked: false,
                        onMountDeposit: jest.fn(),
                    },
                    general_store: {
                        is_cashier_locked: false,
                        is_deposit: false,
                        is_loading: false,
                        is_system_maintenance: false,
                        setActiveTab: jest.fn(),
                        setIsDeposit: jest.fn(),
                    },
                },
            },
        };

        render(<Deposit setSideNotes={jest.fn()} />, {
            wrapper: ({ children }) => <StoreProvider store={mockRootStore}>{children}</StoreProvider>,
        });

        expect(screen.getByText('Virtual')).toBeInTheDocument();
    });

    it('should render <CashierLocked /> component', () => {
        const mockRootStore: DeepPartial<TRootStore> = {
            client: {
                currency: 'USD',
                can_change_fiat_currency: false,
                current_currency_type: 'fiat',
                is_eu: false,
                is_switching: false,
                is_virtual: false,
            },
            modules: {
                cashier: {
                    iframe: {},
                    transaction_history: {
                        is_crypto_transactions_visible: false,
                        onMount: jest.fn(),
                    },
                    deposit: {
                        error: { is_ask_uk_funds_protection: false, message: '', setErrorMessage: jest.fn() },
                        is_deposit_locked: false,
                        onMountDeposit: jest.fn(),
                    },
                    general_store: {
                        is_cashier_locked: true,
                        is_deposit: false,
                        is_loading: false,
                        is_system_maintenance: true,
                        setActiveTab: jest.fn(),
                        setIsDeposit: jest.fn(),
                    },
                },
            },
        };
        const { rerender } = render(<Deposit setSideNotes={jest.fn()} />, {
            wrapper: ({ children }) => <StoreProvider store={mockRootStore}>{children}</StoreProvider>,
        });

        expect(screen.getByText('CashierLocked')).toBeInTheDocument();

        rerender(
            <Deposit setSideNotes={jest.fn()} is_system_maintenance is_deposit_locked current_currency_type='crypto' />
        );

        expect(screen.getByText('CashierLocked')).toBeInTheDocument();

        rerender(<Deposit setSideNotes={jest.fn()} is_cashier_locked />);

        expect(screen.getByText('CashierLocked')).toBeInTheDocument();
    });

    it('should render <FundsProtection /> component', () => {
        const mockRootStore: DeepPartial<TRootStore> = {
            client: {
                currency: 'USD',
                can_change_fiat_currency: false,
                current_currency_type: 'fiat',
                is_eu: false,
                is_switching: false,
                is_virtual: false,
            },
            modules: {
                cashier: {
                    iframe: {},
                    transaction_history: {
                        is_crypto_transactions_visible: false,
                        onMount: jest.fn(),
                    },
                    deposit: {
                        error: { is_ask_uk_funds_protection: true, message: '', setErrorMessage: jest.fn() },
                        is_deposit_locked: false,
                        onMountDeposit: jest.fn(),
                    },
                    general_store: {
                        is_cashier_locked: false,
                        is_deposit: false,
                        is_loading: false,
                        is_system_maintenance: false,
                        setActiveTab: jest.fn(),
                        setIsDeposit: jest.fn(),
                    },
                },
            },
        };

        render(<Deposit setSideNotes={jest.fn()} />, {
            wrapper: ({ children }) => <StoreProvider store={mockRootStore}>{children}</StoreProvider>,
        });

        expect(screen.getByText('FundsProtection')).toBeInTheDocument();
    });

    it('should render <DepositLocked /> component', () => {
        const mockRootStore: DeepPartial<TRootStore> = {
            client: {
                currency: 'USD',
                can_change_fiat_currency: false,
                current_currency_type: 'fiat',
                is_eu: false,
                is_switching: false,
                is_virtual: false,
            },
            modules: {
                cashier: {
                    iframe: {},
                    transaction_history: {
                        is_crypto_transactions_visible: false,
                        onMount: jest.fn(),
                    },
                    deposit: {
                        error: { is_ask_uk_funds_protection: false, message: '', setErrorMessage: jest.fn() },
                        is_deposit_locked: true,
                        onMountDeposit: jest.fn(),
                    },
                    general_store: {
                        is_cashier_locked: false,
                        is_deposit: false,
                        is_loading: false,
                        is_system_maintenance: false,
                        setActiveTab: jest.fn(),
                        setIsDeposit: jest.fn(),
                    },
                },
            },
        };

        render(<Deposit setSideNotes={jest.fn()} />, {
            wrapper: ({ children }) => <StoreProvider store={mockRootStore}>{children}</StoreProvider>,
        });

        expect(screen.getByText('DepositLocked')).toBeInTheDocument();
    });

    it('should render <CryptoTransactionsHistory /> component', () => {
        const mockRootStore: DeepPartial<TRootStore> = {
            client: {
                currency: 'USD',
                can_change_fiat_currency: false,
                current_currency_type: 'fiat',
                is_eu: false,
                is_switching: false,
                is_virtual: false,
            },
            modules: {
                cashier: {
                    iframe: {},
                    transaction_history: {
                        is_crypto_transactions_visible: true,
                        onMount: jest.fn(),
                    },
                    deposit: {
                        error: { is_ask_uk_funds_protection: false, message: '', setErrorMessage: jest.fn() },
                        is_deposit_locked: false,
                        onMountDeposit: jest.fn(),
                    },
                    general_store: {
                        is_cashier_locked: false,
                        is_deposit: false,
                        is_loading: false,
                        is_system_maintenance: false,
                        setActiveTab: jest.fn(),
                        setIsDeposit: jest.fn(),
                    },
                },
            },
        };

        render(<Deposit setSideNotes={jest.fn()} />, {
            wrapper: ({ children }) => <StoreProvider store={mockRootStore}>{children}</StoreProvider>,
        });

        expect(screen.getByText('CryptoTransactionsHistory')).toBeInTheDocument();
    });

    it('should render <Error /> component', () => {
        const mockRootStore: DeepPartial<TRootStore> = {
            client: {
                currency: 'USD',
                can_change_fiat_currency: false,
                current_currency_type: 'fiat',
                is_eu: false,
                is_switching: false,
                is_virtual: false,
            },
            modules: {
                cashier: {
                    iframe: {},
                    transaction_history: {
                        is_crypto_transactions_visible: false,
                        onMount: jest.fn(),
                    },
                    deposit: {
                        error: { is_ask_uk_funds_protection: false, message: 'error', setErrorMessage: jest.fn() },
                        is_deposit_locked: false,
                        onMountDeposit: jest.fn(),
                    },
                    general_store: {
                        is_cashier_locked: false,
                        is_deposit: true,
                        is_loading: false,
                        is_system_maintenance: false,
                        setActiveTab: jest.fn(),
                        setIsDeposit: jest.fn(),
                    },
                },
            },
        };

        render(<Deposit setSideNotes={jest.fn()} />, {
            wrapper: ({ children }) => <StoreProvider store={mockRootStore}>{children}</StoreProvider>,
        });

        expect(screen.getByText('Error')).toBeInTheDocument();
    });

    it('should render <CryptoDeposit /> component', () => {
        const mockRootStore: DeepPartial<TRootStore> = {
            client: {
                currency: 'BTC',
                can_change_fiat_currency: false,
                current_currency_type: 'fiat',
                is_eu: true,
                is_switching: false,
                is_virtual: false,
            },
            modules: {
                cashier: {
                    iframe: {},
                    transaction_history: {
                        is_crypto_transactions_visible: false,
                        onMount: jest.fn(),
                    },
                    deposit: {
                        error: { is_ask_uk_funds_protection: false, message: '', setErrorMessage: jest.fn() },
                        is_deposit_locked: false,
                        onMountDeposit: jest.fn(),
                    },
                    general_store: {
                        is_cashier_locked: false,
                        is_deposit: false,
                        is_loading: false,
                        is_crypto: true,
                        is_system_maintenance: false,
                        setActiveTab: jest.fn(),
                        setIsDeposit: jest.fn(),
                    },
                },
            },
        };

        render(<Deposit setSideNotes={jest.fn()} />, {
            wrapper: ({ children }) => <StoreProvider store={mockRootStore}>{children}</StoreProvider>,
        });

        expect(screen.getByText('CryptoDeposit')).toBeInTheDocument();
    });

    it('should render <Real /> component', () => {
        const mockRootStore: DeepPartial<TRootStore> = {
            client: {
                currency: 'USD',
                can_change_fiat_currency: false,
                current_currency_type: 'fiat',
                is_eu: false,
                is_switching: false,
                is_virtual: false,
            },
            modules: {
                cashier: {
                    iframe: {},
                    transaction_history: {
                        is_crypto_transactions_visible: false,
                        onMount: jest.fn(),
                    },
                    deposit: {
                        error: { is_ask_uk_funds_protection: false, message: '', setErrorMessage: jest.fn() },
                        is_deposit_locked: false,
                        onMountDeposit: jest.fn(),
                    },
                    general_store: {
                        is_cashier_locked: false,
                        is_deposit: true,
                        is_loading: false,
                        is_system_maintenance: false,
                        setActiveTab: jest.fn(),
                        setIsDeposit: jest.fn(),
                    },
                },
            },
        };

        render(<Deposit setSideNotes={jest.fn()} />, {
            wrapper: ({ children }) => <StoreProvider store={mockRootStore}>{children}</StoreProvider>,
        });

        expect(screen.getByText('Real')).toBeInTheDocument();
    });

    it('should render <CashierOnboarding /> component', () => {
        const mockRootStore: DeepPartial<TRootStore> = {
            client: {
                currency: 'USD',
                can_change_fiat_currency: false,
                current_currency_type: 'fiat',
                is_eu: false,
                is_switching: false,
                is_virtual: false,
            },
            modules: {
                cashier: {
                    iframe: {},
                    transaction_history: {
                        is_crypto_transactions_visible: false,
                        onMount: jest.fn(),
                    },
                    deposit: {
                        error: { is_ask_uk_funds_protection: false, message: '', setErrorMessage: jest.fn() },
                        is_deposit_locked: false,
                        onMountDeposit: jest.fn(),
                    },
                    general_store: {
                        is_cashier_locked: false,
                        is_deposit: false,
                        is_loading: false,
                        is_system_maintenance: false,
                        setActiveTab: jest.fn(),
                        setIsDeposit: jest.fn(),
                    },
                },
            },
        };

        render(<Deposit setSideNotes={jest.fn()} />, {
            wrapper: ({ children }) => <StoreProvider store={mockRootStore}>{children}</StoreProvider>,
        });

        expect(screen.getByText('CashierOnboarding')).toBeInTheDocument();
    });

    it('should trigger "setSideNotes" callback', () => {
        const mockRootStore: DeepPartial<TRootStore> = {
            client: {
                currency: 'UST',
                can_change_fiat_currency: false,
                current_currency_type: 'fiat',
                is_eu: false,
                is_switching: false,
                is_virtual: false,
            },
            modules: {
                cashier: {
                    iframe: {},
                    transaction_history: {
                        crypto_transactions: [{}],
                        is_crypto_transactions_visible: false,
                        onMount: jest.fn(),
                    },
                    deposit: {
                        error: { is_ask_uk_funds_protection: false, message: '', setErrorMessage: jest.fn() },
                        is_deposit_locked: false,
                        onMountDeposit: jest.fn(),
                    },
                    general_store: {
                        is_cashier_locked: false,
                        is_crypto: true,
                        is_deposit: true,
                        is_loading: false,
                        is_system_maintenance: false,
                        setActiveTab: jest.fn(),
                        setIsDeposit: jest.fn(),
                    },
                },
            },
        };

        const setSideNotes = jest.fn();

        render(<Deposit setSideNotes={setSideNotes} />, {
            wrapper: ({ children }) => <StoreProvider store={mockRootStore}>{children}</StoreProvider>,
        });

        expect(setSideNotes).toHaveBeenCalledTimes(2);
    });
});
