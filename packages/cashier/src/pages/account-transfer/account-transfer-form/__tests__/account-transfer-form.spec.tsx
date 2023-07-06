import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { isMobile } from '@deriv/shared';
import AccountTransferForm from '../account-transfer-form';
import CashierProviders from '../../../../cashier-providers';
import { mockStore } from '@deriv/stores';
import { TError } from '../../../../types';

jest.mock('@deriv/shared/src/utils/screen/responsive', () => ({
    ...jest.requireActual('@deriv/shared/src/utils/screen/responsive'),
    isMobile: jest.fn(),
}));

let mockRootStore: ReturnType<typeof mockStore>;

jest.mock('Assets/svgs/trading-platform', () =>
    jest.fn(props => <div data-testid={props.icon}>TradingPlatformIcon</div>)
);

describe('<AccountTransferForm />', () => {
    beforeEach(() => {
        mockRootStore = mockStore({
            client: {
                account_limits: {
                    daily_transfers: {
                        dxtrade: {},
                        internal: {},
                        mt5: {},
                    },
                },
                mt5_login_list: [
                    {
                        login: 'value',
                        market_type: 'financial',
                        server_info: {
                            geolocation: {
                                region: 'region',
                                sequence: 0,
                            },
                        },
                    },
                ],
                getLimits: jest.fn(),
                is_dxtrade_allowed: false,
            },
            ui: {
                is_dark_mode_on: false,
            },
            modules: {
                cashier: {
                    general_store: {
                        is_crypto: false,
                    },
                    account_transfer: {
                        accounts_list: [
                            {
                                currency: 'USD',
                                is_mt: false,
                                is_dxtrade: false,
                                market_type: 'gaming',
                                value: 'value',
                            },
                        ],
                        minimum_fee: '0',
                        selected_from: {
                            currency: 'USD',
                            is_mt: false,
                            is_crypto: false,
                            is_dxtrade: false,
                            balance: 0,
                        },
                        selected_to: { currency: 'USD', is_mt: false, is_crypto: false, is_dxtrade: false, balance: 0 },
                        transfer_fee: 2,
                        transfer_limit: {
                            min: 0,
                            max: 1000,
                        },
                        requestTransferBetweenAccounts: jest.fn(),
                        error: {
                            setErrorMessage: jest.fn(),
                        },
                        setAccountTransferAmount: jest.fn(),
                    },
                    crypto_fiat_converter: {
                        resetConverter: jest.fn(),
                    },
                    transaction_history: {
                        onMount: jest.fn(),
                    },
                },
            },
            common: {
                is_from_derivgo: false,
            },
            traders_hub: {
                selected_account: {},
            },
        });
    });
    beforeAll(() => {
        const modal_root_el = document.createElement('div');
        modal_root_el.setAttribute('id', 'modal_root');
        document.body.appendChild(modal_root_el);
    });
    afterAll(() => {
        const modal_root_el = document.createElement('div');
        modal_root_el.setAttribute('id', 'modal_root');
        document.body.removeChild(modal_root_el);
    });

    const props = {
        setSideNotes: jest.fn(),
        error: {
            code: 'testCode',
            message: 'testMessage',
        } as TError,
    };

    const renderAccountTransferForm = () => {
        render(<AccountTransferForm {...props} />, {
            wrapper: ({ children }) => <CashierProviders store={mockRootStore}>{children}</CashierProviders>,
        });
    };

    it('component should be rendered', () => {
        renderAccountTransferForm();

        expect(screen.getByTestId('dt_account_transfer_form_wrapper')).toBeInTheDocument();
        expect(screen.getByText('Cashier Error')).toBeInTheDocument();
    });

    it('should show loader if account_list.length === 0', () => {
        mockRootStore.modules.cashier.account_transfer.accounts_list = [];

        renderAccountTransferForm();

        expect(screen.getByTestId('dt_cashier_loader_wrapper')).toBeInTheDocument();
    });

    it('should show <Form /> component if account_list.length > 0', () => {
        mockRootStore.modules.cashier.account_transfer.accounts_list = [
            {
                currency: 'USD',
                is_mt: false,
                is_dxtrade: false,
                market_type: 'gaming',
                value: 'value',
            },
        ];

        renderAccountTransferForm();

        expect(screen.getByText('From')).toBeInTheDocument();
        expect(screen.getByText('To')).toBeInTheDocument();
        expect(screen.getByTestId('dt_account_transfer_form_drop_down_wrapper')).toBeInTheDocument();
        expect(screen.getByTestId('dt_account_transfer_form_drop_down')).toBeInTheDocument();
        expect(screen.getByTestId('dt_account_transfer_form_to_dropdown')).toBeInTheDocument();
        expect(screen.getByTestId('dt_account_transfer_form_submit')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Transfer' })).toBeInTheDocument();
    });

    it('should show an error if amount is not provided', async () => {
        renderAccountTransferForm();

        const submit_button = screen.getByRole('button', { name: 'Transfer' });
        fireEvent.change(screen.getByTestId('dt_account_transfer_form_input'), { target: { value: '1' } });
        fireEvent.change(screen.getByTestId('dt_account_transfer_form_input'), { target: { value: '' } });
        fireEvent.click(submit_button);

        expect(await screen.findByText('This field is required.')).toBeInTheDocument();
    });

    it('should show an error if transfer amount is greater than balance', async () => {
        mockRootStore.modules.cashier.account_transfer.selected_from.balance = 100;

        renderAccountTransferForm();

        const submit_button = screen.getByRole('button', { name: 'Transfer' });
        fireEvent.change(screen.getByTestId('dt_account_transfer_form_input'), { target: { value: '200' } });
        fireEvent.click(submit_button);

        expect(await screen.findByText('Insufficient balance')).toBeInTheDocument();
    });

    it('should not allow to do transfer if accounts from and to are same', () => {
        (isMobile as jest.Mock).mockReturnValue(true);
        mockRootStore.modules.cashier.account_transfer.accounts_list[0].is_mt = true;
        mockRootStore.modules.cashier.account_transfer.selected_from.is_mt = true;
        mockRootStore.modules.cashier.account_transfer.selected_from.balance = 200;

        renderAccountTransferForm();

        fireEvent.change(screen.getByTestId('dt_account_transfer_form_input'), { target: { value: '100' } });
        fireEvent.click(screen.getByRole('button', { name: 'Transfer' }));

        expect(mockRootStore.modules.cashier.account_transfer.requestTransferBetweenAccounts).not.toHaveBeenCalled();
    });

    it('should show input if same currency', () => {
        renderAccountTransferForm();

        expect(screen.getByTestId('dt_account_transfer_form_input')).toBeInTheDocument();
    });

    it("should show 'Please verify your identity' error if error.code is Fiat2CryptoTransferOverLimit", () => {
        props.error = {
            code: 'Fiat2CryptoTransferOverLimit',
            message: 'testMessage',
        } as TError;

        renderAccountTransferForm();

        expect(screen.getByText('Please verify your identity')).toBeInTheDocument();
    });

    it("should show 'Cashier error' error if error.code is unexpected", () => {
        props.error = {
            code: 'testCode',
            message: 'testMessage',
        } as TError;

        renderAccountTransferForm();

        expect(screen.getByText('Cashier Error')).toBeInTheDocument();
    });

    it('should show proper hint about mt5 remained transfers', () => {
        (isMobile as jest.Mock).mockReturnValue(true);
        mockRootStore.client.account_limits = {
            daily_transfers: {
                dxtrade: {},
                internal: {},
                mt5: {
                    available: 1,
                },
            },
        };
        mockRootStore.modules.cashier.account_transfer.selected_from.is_mt = true;
        mockRootStore.modules.cashier.account_transfer.selected_to.is_mt = true;

        renderAccountTransferForm();

        expect(screen.getByText('You have 1 transfer remaining for today.')).toBeInTheDocument();
    });

    it('should show proper hint about dxtrade remained transfers', () => {
        (isMobile as jest.Mock).mockReturnValue(true);

        mockRootStore.client.account_limits = {
            daily_transfers: {
                dxtrade: {
                    available: 1,
                },
                internal: {},
                mt5: {},
            },
        };
        mockRootStore.modules.cashier.account_transfer.selected_from.is_dxtrade = true;
        mockRootStore.modules.cashier.account_transfer.selected_from.currency = 'USD';
        mockRootStore.modules.cashier.account_transfer.selected_to.is_dxtrade = true;
        mockRootStore.modules.cashier.account_transfer.selected_to.currency = 'USD';

        renderAccountTransferForm();

        expect(screen.getByText('You have 1 transfer remaining for today.')).toBeInTheDocument();
    });

    it('should show proper hint about internal remained transfers', () => {
        (isMobile as jest.Mock).mockReturnValue(true);
        mockRootStore.client.account_limits = {
            daily_transfers: {
                dxtrade: {},
                internal: {
                    available: 1,
                },
                mt5: {},
            },
        };

        renderAccountTransferForm();

        expect(screen.getByText('You have 1 transfer remaining for today.')).toBeInTheDocument();
    });

    describe('<Dropdown />', () => {
        const accountsList = [
            {
                currency: 'BTC',
                is_mt: false,
                is_dxtrade: false,
                is_derivez: false,
                is_crypto: true,
                text: 'BTC',
                value: 'CR90000249',
            },
            {
                currency: 'USD',
                is_mt: false,
                is_dxtrade: false,
                is_derivez: false,
                is_crypto: false,
                text: 'USD',
                value: 'CR90000212',
            },
            {
                currency: 'USD',
                platform_icon: 'IcDerivez',
                is_mt: false,
                is_dxtrade: false,
                is_derivez: true,
                is_crypto: false,
                text: 'Deriv EZ',
                value: 'EZR80000469',
            },
            {
                currency: 'USD',
                is_mt: false,
                is_dxtrade: true,
                is_derivez: false,
                is_crypto: false,
                platform_icon: 'IcDeriv X',
                text: 'Deriv X',
                value: 'DXR1029',
            },
            {
                text: 'USD',
                currency: 'USD',
                value: 'MTR40013177',
                platform_icon: 'Derived',
                is_crypto: false,
                is_mt: true,
                is_dxtrade: false,
                is_derivez: false,
            },
        ];

        const derivez_account = {
            currency: 'USD',
            is_mt: false,
            is_dxtrade: false,
            is_derivez: true,
            is_crypto: false,
            text: 'Deriv EZ',
            value: 'EZR80000469',
        };

        const derivx_account = {
            currency: 'USD',
            is_mt: false,
            is_dxtrade: true,
            is_derivez: false,
            is_crypto: false,
            platform_icon: 'IcDxtradeDeriv X',
            text: 'Deriv X',
            value: 'DXR1029',
        };

        const currency_usd_account = {
            text: 'USD',
            value: 'CR90000212',
            balance: '9953.89',
            currency: 'USD',
            is_crypto: false,
            is_mt: false,
            is_dxtrade: false,
            is_derivez: false,
        };

        const currency_btc_account = {
            text: 'BTC',
            value: 'CR90000249',
            currency: 'BTC',
            is_crypto: true,
            is_mt: false,
            is_dxtrade: false,
            is_derivez: false,
        };

        const mt5_account = {
            text: 'USD',
            currency: 'USD',
            value: 'MTR40013177',
            is_crypto: false,
            is_mt: true,
            is_dxtrade: false,
            is_derivez: false,
        };

        describe('from_dropdown', () => {
            it('should check for USD icon when USD is selected in from_dropdown', () => {
                mockRootStore.modules.cashier.account_transfer.accounts_list = accountsList;
                mockRootStore.modules.cashier.account_transfer.selected_from = currency_usd_account;
                mockRootStore.modules.cashier.account_transfer.setTransferPercentageSelectorResult = jest
                    .fn()
                    .mockReturnValue(10.0);

                renderAccountTransferForm();
                expect(screen.getByTestId('dt_account_platform_icon_currency_usd')).toBeInTheDocument();
            });

            it('should check for icon BTC when BTC is selected in from dropdown', () => {
                mockRootStore.modules.cashier.account_transfer.accounts_list = accountsList;
                mockRootStore.modules.cashier.account_transfer.selected_from = currency_btc_account;
                mockRootStore.modules.cashier.account_transfer.setTransferPercentageSelectorResult = jest
                    .fn()
                    .mockReturnValue(100.0);

                renderAccountTransferForm();
                expect(screen.getByTestId('dt_account_platform_icon_currency_btc')).toBeInTheDocument();
            });

            it('should check for derivez icon when derivez is selected in from_dropdown', () => {
                mockRootStore.modules.cashier.account_transfer.accounts_list = accountsList;
                mockRootStore.modules.cashier.account_transfer.selected_from = derivez_account;
                mockRootStore.modules.cashier.account_transfer.setTransferPercentageSelectorResult = jest
                    .fn()
                    .mockReturnValue(100.0);

                renderAccountTransferForm();
                expect(screen.getByTestId('dt_account_platform_icon_IcDerivez')).toBeInTheDocument();
            });

            it('should check for MT5 icon when MT5 is selected in from_dropdown', () => {
                mockRootStore.modules.cashier.account_transfer.accounts_list = accountsList;
                mockRootStore.modules.cashier.account_transfer.selected_from = mt5_account;
                mockRootStore.modules.cashier.account_transfer.setTransferPercentageSelectorResult = jest
                    .fn()
                    .mockReturnValue(100.0);

                renderAccountTransferForm();
                expect(screen.getByTestId('Derived')).toBeInTheDocument();
            });

            it('should check for DerivX icon when DerivX is selected in from_dropdown', () => {
                mockRootStore.modules.cashier.account_transfer.accounts_list = accountsList;
                mockRootStore.modules.cashier.account_transfer.selected_from = derivx_account;
                mockRootStore.modules.cashier.account_transfer.setTransferPercentageSelectorResult = jest
                    .fn()
                    .mockReturnValue(100.0);

                renderAccountTransferForm();
                expect(screen.getByTestId('dt_account_platform_icon_IcDeriv X')).toBeInTheDocument();
            });
        });
    });
});
