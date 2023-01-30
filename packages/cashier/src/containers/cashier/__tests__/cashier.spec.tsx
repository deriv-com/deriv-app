import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { createBrowserHistory } from 'history';
import { Router } from 'react-router';
import { isMobile } from '@deriv/shared';
import getRoutesConfig from 'Constants/routes-config';
import Cashier from '../cashier';
import { TRootStore } from 'Types';
import CashierProviders from '../../../cashier-providers';

jest.mock('@deriv/components', () => {
    const original_module = jest.requireActual('@deriv/components');

    return {
        ...original_module,
        Loading: jest.fn(() => 'mockedLoading'),
    };
});

jest.mock('@deriv/shared', () => {
    const original_module = jest.requireActual('@deriv/shared');

    return {
        ...original_module,
        isMobile: jest.fn(() => false),
        WS: {
            wait: (...payload) => {
                return Promise.resolve([...payload]);
            },
        },
    };
});

jest.mock('Components/account-prompt-dialog', () => jest.fn(() => 'mockedAccountPromptDialog'));
jest.mock('Components/error-dialog', () => jest.fn(() => 'mockedErrorDialog'));
jest.mock('Pages/deposit', () => jest.fn(() => 'mockedDeposit'));
jest.mock('Pages/withdrawal', () => jest.fn(() => 'mockedWithdrawal'));

describe('<Cashier />', () => {
    let history;
    const renderWithRouter = (component: JSX.Element, mockRootStore: TRootStore) => {
        history = createBrowserHistory();
        return {
            ...render(<Router history={history}>{component}</Router>, {
                wrapper: ({ children }) => <CashierProviders store={mockRootStore}>{children}</CashierProviders>,
            }),
        };
    };

    it('should show the loading component if client_tnc_status is not yet loaded or not yet logged in', () => {
        const mockRootStore: DeepPartial<TRootStore> = {
            common: {
                routeBackInApp: jest.fn(),
                is_from_derivgo: true,
            },
            ui: {
                is_cashier_visible: false,
                toggleCashier: jest.fn(),
            },
            client: {
                is_account_setting_loaded: false,
                is_logged_in: false,
                is_logging_in: true,
            },
            modules: {
                cashier: {
                    withdraw: {
                        error: {},
                    },
                    general_store: {
                        is_cashier_onboarding: false,
                        is_loading: false,
                        is_p2p_enabled: false,
                        onMountCommon: jest.fn(),
                        p2p_notification_count: 0,
                        setAccountSwitchListener: jest.fn(),
                        setCashierTabIndex: jest.fn(),
                        cashier_route_tab_index: 0,
                    },
                    account_transfer: {
                        is_account_transfer_visible: false,
                    },
                    transaction_history: {
                        is_crypto_transactions_visible: false,
                    },
                    onramp: {
                        is_onramp_tab_visible: false,
                    },
                    payment_agent_transfer: {
                        is_payment_agent_transfer_visible: false,
                    },
                    payment_agent: {
                        is_payment_agent_visible: false,
                    },
                    account_prompt_dialog: {
                        resetLastLocation: jest.fn(),
                    },
                },
            },
        };

        renderWithRouter(<Cashier routes={getRoutesConfig()[0].routes || []} />, mockRootStore as TRootStore);

        expect(screen.getByText('mockedLoading')).toBeInTheDocument();
    });

    it('should render the component if client_tnc_status is loaded', () => {
        const mockRootStore: DeepPartial<TRootStore> = {
            common: {
                routeBackInApp: jest.fn(),
                is_from_derivgo: true,
            },
            ui: {
                is_cashier_visible: true,
                toggleCashier: jest.fn(),
            },
            client: {
                is_account_setting_loaded: true,
                is_logged_in: true,
                is_logging_in: true,
            },
            modules: {
                cashier: {
                    withdraw: {
                        error: {},
                    },
                    general_store: {
                        is_cashier_onboarding: true,
                        is_loading: true,
                        is_p2p_enabled: true,
                        onMountCommon: jest.fn(),
                        p2p_notification_count: 0,
                        setAccountSwitchListener: jest.fn(),
                        setCashierTabIndex: jest.fn(),
                        cashier_route_tab_index: 0,
                    },
                    account_transfer: {
                        is_account_transfer_visible: true,
                    },
                    transaction_history: {
                        is_crypto_transactions_visible: true,
                    },
                    onramp: {
                        is_onramp_tab_visible: true,
                    },
                    payment_agent_transfer: {
                        is_payment_agent_transfer_visible: true,
                    },
                    payment_agent: {
                        is_payment_agent_visible: true,
                    },
                    account_prompt_dialog: {
                        resetLastLocation: jest.fn(),
                    },
                },
            },
        };

        renderWithRouter(<Cashier routes={getRoutesConfig()[0].routes || []} />, mockRootStore as TRootStore);

        expect(screen.getByRole('link', { name: 'Deposit' })).toBeInTheDocument();
        expect(screen.getByRole('link', { name: 'Withdrawal' })).toBeInTheDocument();
        expect(screen.getByRole('link', { name: 'Transfer' })).toBeInTheDocument();
        expect(screen.getByRole('link', { name: 'Payment agents' })).toBeInTheDocument();
        expect(screen.getByRole('link', { name: 'Transfer to client' })).toBeInTheDocument();
        expect(screen.getByRole('link', { name: 'Deriv P2P' })).toBeInTheDocument();
        expect(screen.getByRole('link', { name: 'Fiat onramp' })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Learn more about payment methods' })).toBeInTheDocument();
    });

    it('should go to payment methods page if the learn more about payment methods button is clicked', () => {
        window.open = jest.fn();

        const mockRootStore: DeepPartial<TRootStore> = {
            common: {
                routeBackInApp: jest.fn(),
                is_from_derivgo: true,
            },
            ui: {
                is_cashier_visible: true,
                toggleCashier: jest.fn(),
            },
            client: {
                is_account_setting_loaded: true,
                is_logged_in: true,
                is_logging_in: true,
            },
            modules: {
                cashier: {
                    withdraw: {
                        error: {},
                    },
                    general_store: {
                        is_cashier_onboarding: true,
                        is_loading: true,
                        is_p2p_enabled: true,
                        onMountCommon: jest.fn(),
                        p2p_notification_count: 0,
                        setAccountSwitchListener: jest.fn(),
                        setCashierTabIndex: jest.fn(),
                        cashier_route_tab_index: 0,
                    },
                    account_transfer: {
                        is_account_transfer_visible: true,
                    },
                    transaction_history: {
                        is_crypto_transactions_visible: true,
                    },
                    onramp: {
                        is_onramp_tab_visible: true,
                    },
                    payment_agent_transfer: {
                        is_payment_agent_transfer_visible: true,
                    },
                    payment_agent: {
                        is_payment_agent_visible: true,
                    },
                    account_prompt_dialog: {
                        resetLastLocation: jest.fn(),
                    },
                },
            },
        };

        renderWithRouter(<Cashier routes={getRoutesConfig()[0].routes || []} />, mockRootStore as TRootStore);

        const learn_more_btn = screen.getByRole('button', { name: 'Learn more about payment methods' });
        fireEvent.click(learn_more_btn);

        expect(window.open).toHaveBeenCalledWith('https://deriv.com/payment-methods');
    });

    // TODO: Fix this test case
    // it('should redirect to trade page if the close button is clicked ', () => {
    //     const mockRootStore: DeepPartial<TRootStore> = {
    //         common: {
    //             routeBackInApp: jest.fn(),
    //             is_from_derivgo: true,
    //         },
    //         ui: {
    //             is_cashier_visible: true,
    //             toggleCashier: jest.fn(),
    //         },
    //         client: {
    //             is_account_setting_loaded: true,
    //             is_logged_in: true,
    //             is_logging_in: false,
    //         },
    //         modules: {
    //             cashier: {
    //                 withdraw: {
    //                     error: {},
    //                 },
    //                 general_store: {
    //                     is_cashier_onboarding: false,
    //                     is_loading: false,
    //                     is_p2p_enabled: true,
    //                     onMountCommon: jest.fn(),
    //                     p2p_notification_count: 0,
    //                     setAccountSwitchListener: jest.fn(),
    //                     setCashierTabIndex: jest.fn(),
    //                     cashier_route_tab_index: 0,
    //                 },
    //                 account_transfer: {
    //                     is_account_transfer_visible: true,
    //                 },
    //                 transaction_history: {
    //                     is_crypto_transactions_visible: false,
    //                 },
    //                 onramp: {
    //                     is_onramp_tab_visible: true,
    //                 },
    //                 payment_agent_transfer: {
    //                     is_payment_agent_transfer_visible: true,
    //                 },
    //                 payment_agent: {
    //                     is_payment_agent_visible: true,
    //                 },
    //                 account_prompt_dialog: {
    //                     resetLastLocation: jest.fn(),
    //                 },
    //             },
    //         },
    //     };

    //     renderWithRouter(<Cashier routes={getRoutesConfig()[0].routes || []} />, mockRootStore as TRootStore);

    //     const close_btn = screen.getByTestId('page_overlay_header_close');
    //     fireEvent.click(close_btn);

    //     expect(mockRootStore.common!.routeBackInApp).toHaveBeenCalled();
    //     expect(history.location.pathname).toBe('/');
    // });

    it('should go to selected route page on desktop', () => {
        const mockRootStore: DeepPartial<TRootStore> = {
            common: {
                routeBackInApp: jest.fn(),
                is_from_derivgo: true,
            },
            ui: {
                is_cashier_visible: true,
                toggleCashier: jest.fn(),
            },
            client: {
                is_account_setting_loaded: true,
                is_logged_in: true,
                is_logging_in: true,
            },
            modules: {
                cashier: {
                    withdraw: {
                        error: {},
                    },
                    general_store: {
                        is_cashier_onboarding: true,
                        is_loading: true,
                        is_p2p_enabled: true,
                        onMountCommon: jest.fn(),
                        p2p_notification_count: 0,
                        setAccountSwitchListener: jest.fn(),
                        setCashierTabIndex: jest.fn(),
                        cashier_route_tab_index: 0,
                    },
                    account_transfer: {
                        is_account_transfer_visible: true,
                    },
                    transaction_history: {
                        is_crypto_transactions_visible: true,
                    },
                    onramp: {
                        is_onramp_tab_visible: true,
                    },
                    payment_agent_transfer: {
                        is_payment_agent_transfer_visible: true,
                    },
                    payment_agent: {
                        is_payment_agent_visible: true,
                    },
                    account_prompt_dialog: {
                        resetLastLocation: jest.fn(),
                    },
                },
            },
        };

        renderWithRouter(<Cashier routes={getRoutesConfig()[0].routes || []} />, mockRootStore as TRootStore);

        const withdrawal_link = screen.getByRole('link', { name: 'Withdrawal' });
        fireEvent.click(withdrawal_link);

        expect(history.location.pathname).toBe('/cashier/withdrawal');
    });

    it('should not render the side note if on crypto transactions page', () => {
        const mockRootStore: DeepPartial<TRootStore> = {
            common: {
                routeBackInApp: jest.fn(),
                is_from_derivgo: true,
            },
            ui: {
                is_cashier_visible: true,
                toggleCashier: jest.fn(),
            },
            client: {
                is_account_setting_loaded: true,
                is_logged_in: true,
                is_logging_in: true,
            },
            modules: {
                cashier: {
                    withdraw: {
                        error: {},
                    },
                    general_store: {
                        is_cashier_onboarding: true,
                        is_loading: true,
                        is_p2p_enabled: true,
                        onMountCommon: jest.fn(),
                        p2p_notification_count: 0,
                        setAccountSwitchListener: jest.fn(),
                        setCashierTabIndex: jest.fn(),
                        cashier_route_tab_index: 0,
                    },
                    account_transfer: {
                        is_account_transfer_visible: true,
                    },
                    transaction_history: {
                        is_crypto_transactions_visible: true,
                    },
                    onramp: {
                        is_onramp_tab_visible: true,
                    },
                    payment_agent_transfer: {
                        is_payment_agent_transfer_visible: true,
                    },
                    payment_agent: {
                        is_payment_agent_visible: true,
                    },
                    account_prompt_dialog: {
                        resetLastLocation: jest.fn(),
                    },
                },
            },
        };

        renderWithRouter(<Cashier routes={getRoutesConfig()[0].routes || []} />, mockRootStore as TRootStore);

        expect(screen.queryByTestId('vertical_tab_side_note')).not.toBeInTheDocument();
    });

    it('should show the selected route page on mobile', () => {
        (isMobile as jest.Mock).mockReturnValue(true);

        const mockRootStore: DeepPartial<TRootStore> = {
            common: {
                routeBackInApp: jest.fn(),
                is_from_derivgo: true,
            },
            ui: {
                is_cashier_visible: true,
                toggleCashier: jest.fn(),
            },
            client: {
                is_account_setting_loaded: true,
                is_logged_in: true,
                is_logging_in: false,
            },
            modules: {
                cashier: {
                    withdraw: {
                        error: {},
                    },
                    general_store: {
                        is_cashier_onboarding: true,
                        is_loading: true,
                        is_p2p_enabled: true,
                        onMountCommon: jest.fn(),
                        p2p_notification_count: 0,
                        setAccountSwitchListener: jest.fn(),
                        setCashierTabIndex: jest.fn(),
                        cashier_route_tab_index: 0,
                    },
                    account_transfer: {
                        is_account_transfer_visible: true,
                    },
                    transaction_history: {
                        is_crypto_transactions_visible: true,
                    },
                    onramp: {
                        is_onramp_tab_visible: true,
                    },
                    payment_agent_transfer: {
                        is_payment_agent_transfer_visible: true,
                    },
                    payment_agent: {
                        is_payment_agent_visible: true,
                    },
                    account_prompt_dialog: {
                        resetLastLocation: jest.fn(),
                    },
                },
            },
        };

        renderWithRouter(<Cashier routes={getRoutesConfig()[0].routes || []} />, mockRootStore as TRootStore);

        const withdrawal_link = screen.getByRole('link', { name: 'Withdrawal' });
        fireEvent.click(withdrawal_link);

        expect(history.location.pathname).toBe('/cashier/withdrawal');
    });
});
