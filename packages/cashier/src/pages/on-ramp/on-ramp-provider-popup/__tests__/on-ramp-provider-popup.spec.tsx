import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import OnRampProviderPopup from '../on-ramp-provider-popup';
import { StoreProvider } from '@deriv/stores';
import { TRootStore } from 'Types';

jest.mock('@deriv/components', () => ({
    ...(jest.requireActual('@deriv/components') as any),
    Loading: () => <div>Loading</div>,
}));

describe('<OnRampProviderPopup />', () => {
    it('should not render <OnRampProviderPopup /> component', () => {
        const mockRootStore: DeepPartial<TRootStore> = {
            ui: {
                is_dark_mode_on: true,
            },
            modules: {
                cashier: {
                    onramp: {
                        api_error: '',
                        deposit_address: 'tb1qhux20f7h42ya9nqdntl6r9p7p264a2ct8t3n6p',
                        is_deposit_address_loading: false,
                        is_requesting_widget_html: false,
                        selected_provider: null,
                        should_show_dialog: false,
                        should_show_widget: false,
                        widget_error: '',
                        widget_html: 'Widget HTML',
                        onClickDisclaimerContinue: jest.fn(),
                        onClickGoToDepositPage: jest.fn(),
                        setIsOnRampModalOpen: jest.fn(),
                    },
                },
            },
        };

        render(<OnRampProviderPopup />, {
            wrapper: ({ children }) => <StoreProvider store={mockRootStore as TRootStore}>{children}</StoreProvider>,
        });

        expect(screen.queryByTestId('dti_on-ramp_popup')).not.toBeInTheDocument();
    });

    it('should show loader', () => {
        const mockRootStore: DeepPartial<TRootStore> = {
            ui: {
                is_dark_mode_on: true,
            },
            modules: {
                cashier: {
                    onramp: {
                        api_error: '',
                        deposit_address: 'tb1qhux20f7h42ya9nqdntl6r9p7p264a2ct8t3n6p',
                        is_deposit_address_loading: true,
                        is_requesting_widget_html: true,
                        selected_provider: {
                            name: 'Changelly',
                            should_show_deposit_address: true,
                            onMountWidgetContainer: jest.fn(),
                        },
                        should_show_dialog: false,
                        should_show_widget: true,
                        widget_error: '',
                        widget_html: 'Widget HTML',
                        onClickDisclaimerContinue: jest.fn(),
                        onClickGoToDepositPage: jest.fn(),
                        setIsOnRampModalOpen: jest.fn(),
                    },
                },
            },
        };

        render(<OnRampProviderPopup />, {
            wrapper: ({ children }) => <StoreProvider store={mockRootStore as TRootStore}>{children}</StoreProvider>,
        });

        expect(screen.getByText('Loading')).toBeInTheDocument();
    });

    it('should show widget', () => {
        const mockRootStore: DeepPartial<TRootStore> = {
            ui: {
                is_dark_mode_on: true,
            },
            modules: {
                cashier: {
                    onramp: {
                        api_error: '',
                        deposit_address: 'tb1qhux20f7h42ya9nqdntl6r9p7p264a2ct8t3n6p',
                        is_deposit_address_loading: false,
                        is_requesting_widget_html: false,
                        selected_provider: {
                            name: 'Changelly',
                            should_show_deposit_address: true,
                            onMountWidgetContainer: jest.fn(),
                        },
                        should_show_dialog: false,
                        should_show_widget: true,
                        widget_error: 'Widget error',
                        widget_html: 'Widget HTML',
                        onClickDisclaimerContinue: jest.fn(),
                        onClickGoToDepositPage: jest.fn(),
                        setIsOnRampModalOpen: jest.fn(),
                    },
                },
            },
        };

        render(<OnRampProviderPopup />, {
            wrapper: ({ children }) => <StoreProvider store={mockRootStore as TRootStore}>{children}</StoreProvider>,
        });

        expect(screen.getByText('Widget error')).toBeInTheDocument();
    });

    it('should show dialog with proper messages and buttons', () => {
        const mockRootStore: DeepPartial<TRootStore> = {
            ui: {
                is_dark_mode_on: true,
            },
            modules: {
                cashier: {
                    onramp: {
                        api_error: 'error',
                        deposit_address: 'tb1qhux20f7h42ya9nqdntl6r9p7p264a2ct8t3n6p',
                        is_deposit_address_loading: false,
                        is_requesting_widget_html: false,
                        selected_provider: {
                            name: 'Changelly',
                            should_show_deposit_address: true,
                            onMountWidgetContainer: jest.fn(),
                        },
                        should_show_dialog: true,
                        should_show_widget: false,
                        widget_error: '',
                        widget_html: 'Widget HTML',
                        onClickDisclaimerContinue: jest.fn(),
                        onClickGoToDepositPage: jest.fn(),
                        setIsOnRampModalOpen: jest.fn(),
                    },
                },
            },
        };

        render(<OnRampProviderPopup />, {
            wrapper: ({ children }) => <StoreProvider store={mockRootStore as TRootStore}>{children}</StoreProvider>,
        });

        expect(screen.getByText('Please go to the Deposit page to get an address.')).toBeInTheDocument();
    });

    it('should show dialog with proper messages and buttons', () => {
        const mockRootStore: DeepPartial<TRootStore> = {
            ui: {
                is_dark_mode_on: true,
            },
            modules: {
                cashier: {
                    onramp: {
                        api_error: '',
                        deposit_address: 'tb1qhux20f7h42ya9nqdntl6r9p7p264a2ct8t3n6p',
                        is_deposit_address_loading: false,
                        is_requesting_widget_html: false,
                        selected_provider: {
                            name: 'Changelly',
                            should_show_deposit_address: true,
                            onMountWidgetContainer: jest.fn(),
                        },
                        should_show_dialog: true,
                        should_show_widget: false,
                        widget_error: '',
                        widget_html: 'Widget HTML',
                        onClickDisclaimerContinue: jest.fn(),
                        onClickGoToDepositPage: jest.fn(),
                        setIsOnRampModalOpen: jest.fn(),
                    },
                },
            },
        };

        render(<OnRampProviderPopup />, {
            wrapper: ({ children }) => <StoreProvider store={mockRootStore as TRootStore}>{children}</StoreProvider>,
        });

        expect(
            screen.getByText(
                'Please go to the Deposit page to generate an address. Then come back here to continue with your transaction.'
            )
        ).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Cancel' })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Go to Deposit page' })).toBeInTheDocument();
    });

    it('should trigger onClick callbacks in dialog when the user clicks "Cancel" and "Go to Deposit page" buttons', () => {
        const mockRootStore: DeepPartial<TRootStore> = {
            ui: {
                is_dark_mode_on: true,
            },
            modules: {
                cashier: {
                    onramp: {
                        api_error: '',
                        deposit_address: 'tb1qhux20f7h42ya9nqdntl6r9p7p264a2ct8t3n6p',
                        is_deposit_address_loading: false,
                        is_requesting_widget_html: false,
                        selected_provider: {
                            name: 'Changelly',
                            should_show_deposit_address: true,
                            onMountWidgetContainer: jest.fn(),
                        },
                        should_show_dialog: true,
                        should_show_widget: false,
                        widget_error: '',
                        widget_html: 'Widget HTML',
                        onClickDisclaimerContinue: jest.fn(),
                        onClickGoToDepositPage: jest.fn(),
                        setIsOnRampModalOpen: jest.fn(),
                    },
                },
            },
        };

        render(<OnRampProviderPopup />, {
            wrapper: ({ children }) => <StoreProvider store={mockRootStore as TRootStore}>{children}</StoreProvider>,
        });

        const cancel_btn = screen.getByRole('button', { name: 'Cancel' });
        fireEvent.click(cancel_btn);

        expect(mockRootStore.modules!.cashier!.onramp.setIsOnRampModalOpen).toHaveBeenCalledTimes(1);

        const go_to_deposit_page_btn = screen.getByRole('button', { name: 'Go to Deposit page' });
        fireEvent.click(go_to_deposit_page_btn);

        expect(mockRootStore.modules!.cashier!.onramp.onClickGoToDepositPage).toHaveBeenCalledTimes(1);
    });

    it('should show proper messages and buttons', () => {
        const mockRootStore: DeepPartial<TRootStore> = {
            ui: {
                is_dark_mode_on: true,
            },
            modules: {
                cashier: {
                    onramp: {
                        api_error: '',
                        deposit_address: 'tb1qhux20f7h42ya9nqdntl6r9p7p264a2ct8t3n6p',
                        is_deposit_address_loading: false,
                        is_requesting_widget_html: false,
                        selected_provider: {
                            name: 'Changelly',
                            should_show_deposit_address: true,
                            onMountWidgetContainer: jest.fn(),
                        },
                        should_show_dialog: false,
                        should_show_widget: false,
                        widget_error: '',
                        widget_html: 'Widget HTML',
                        onClickDisclaimerContinue: jest.fn(),
                        onClickGoToDepositPage: jest.fn(),
                        setIsOnRampModalOpen: jest.fn(),
                    },
                },
            },
        };

        render(<OnRampProviderPopup />, {
            wrapper: ({ children }) => <StoreProvider store={mockRootStore as TRootStore}>{children}</StoreProvider>,
        });

        expect(
            screen.getByText(
                "Please copy the crypto address you see below. You'll need it to deposit your cryptocurrency."
            )
        ).toBeInTheDocument();
        expect(
            screen.getByText('This address can only be used ONCE. Please copy a new one for your next transaction.')
        ).toBeInTheDocument();
        expect(screen.getByText('Disclaimer')).toBeInTheDocument();
        expect(
            screen.getByText(
                "By clicking 'Continue' you will be redirected to Changelly, a third-party payment service provider. Please note that Deriv is not responsible for the content or services provided by Changelly. If you encounter any issues related to Changelly services, you must contact Changelly directly."
            )
        ).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Cancel' })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Continue' })).toBeInTheDocument();
    });

    it('should trigger onFocus method when the user clicks on deposit address field', () => {
        const mockRootStore: DeepPartial<TRootStore> = {
            ui: {
                is_dark_mode_on: true,
            },
            modules: {
                cashier: {
                    onramp: {
                        api_error: '',
                        deposit_address: 'tb1qhux20f7h42ya9nqdntl6r9p7p264a2ct8t3n6p',
                        is_deposit_address_loading: false,
                        is_requesting_widget_html: false,
                        selected_provider: {
                            name: 'Changelly',
                            should_show_deposit_address: true,
                            onMountWidgetContainer: jest.fn(),
                        },
                        should_show_dialog: false,
                        should_show_widget: false,
                        widget_error: '',
                        widget_html: 'Widget HTML',
                        onClickDisclaimerContinue: jest.fn(),
                        onClickGoToDepositPage: jest.fn(),
                        setIsOnRampModalOpen: jest.fn(),
                    },
                },
            },
        };

        render(<OnRampProviderPopup />, {
            wrapper: ({ children }) => <StoreProvider store={mockRootStore as TRootStore}>{children}</StoreProvider>,
        });

        const deposit_address_input = screen.getByRole('textbox');
        expect(fireEvent.focus(deposit_address_input)).toBeTruthy();
    });

    it('should trigger onClick calbacks when the user clicks on "Cancel" and "Continue" buttons', () => {
        const mockRootStore: DeepPartial<TRootStore> = {
            ui: {
                is_dark_mode_on: true,
            },
            modules: {
                cashier: {
                    onramp: {
                        api_error: '',
                        deposit_address: 'tb1qhux20f7h42ya9nqdntl6r9p7p264a2ct8t3n6p',
                        is_deposit_address_loading: false,
                        is_requesting_widget_html: false,
                        selected_provider: {
                            name: 'Changelly',
                            should_show_deposit_address: true,
                            onMountWidgetContainer: jest.fn(),
                        },
                        should_show_dialog: false,
                        should_show_widget: false,
                        widget_error: '',
                        widget_html: 'Widget HTML',
                        onClickDisclaimerContinue: jest.fn(),
                        onClickGoToDepositPage: jest.fn(),
                        setIsOnRampModalOpen: jest.fn(),
                    },
                },
            },
        };

        render(<OnRampProviderPopup />, {
            wrapper: ({ children }) => <StoreProvider store={mockRootStore as TRootStore}>{children}</StoreProvider>,
        });

        const cancel_btn = screen.getByRole('button', { name: 'Cancel' });
        fireEvent.click(cancel_btn);

        expect(mockRootStore.modules!.cashier!.onramp.setIsOnRampModalOpen).toHaveBeenCalledTimes(1);

        const continue_btn = screen.getByRole('button', { name: 'Continue' });
        fireEvent.click(continue_btn);

        expect(mockRootStore.modules!.cashier!.onramp.onClickDisclaimerContinue).toHaveBeenCalledTimes(1);
    });
});
