import React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import AccountTransferForm from '../account-transfer-form';

jest.mock('Stores/connect.js', () => ({
    __esModule: true,
    default: 'mockedDefaultExport',
    connect: () => Component => Component,
}));

describe('<AccountTransferForm />', () => {
    beforeAll(() => {
        const modal_root_el = document.createElement('div');
        modal_root_el.setAttribute('id', 'modal_root');
        document.body.appendChild(modal_root_el);
    });
    afterAll(() => {
        document.body.removeChild(modal_root_el);
    });
    const account_limits = {
        daily_transfers: {
            mt5: {},
            dxtrade: {},
            internal: {},
        },
    };
    const accounts_list = [];
    const selected_from = { is_mt: true };
    const selected_to = { is_mt: true };

    it('component should be rendered', () => {
        const onMount = jest.fn();
        const resetConverter = jest.fn();
        const recentTransactionOnMount = jest.fn();

        const { container } = render(
            <AccountTransferForm
                accounts_list={accounts_list}
                account_limits={account_limits}
                onMount={onMount}
                resetConverter={resetConverter}
                recentTransactionOnMount={recentTransactionOnMount}
                selected_from={selected_from}
                selected_to={selected_to}
            />
        );

        expect(container.querySelector('.account-transfer-form__wrapper')).toBeInTheDocument();
        expect(screen.getByText('Transfer between your accounts in Deriv')).toBeInTheDocument();
    });

    it('should show loader if account_list.length === 0', () => {
        const onMount = jest.fn();
        const resetConverter = jest.fn();
        const recentTransactionOnMount = jest.fn();

        const { container } = render(
            <AccountTransferForm
                accounts_list={accounts_list}
                account_limits={account_limits}
                onMount={onMount}
                resetConverter={resetConverter}
                recentTransactionOnMount={recentTransactionOnMount}
                selected_from={selected_from}
                selected_to={selected_to}
            />
        );

        expect(container.querySelector('.cashier__loader-wrapper')).toBeInTheDocument();
    });

    it('should show <Form /> component if account_list.length > 0', () => {
        const accounts_list = [1, 2, 3];
        const mt5_login_list = [];
        const onMount = jest.fn();
        const resetConverter = jest.fn();
        const recentTransactionOnMount = jest.fn();
        const transfer_limit = {
            min: 0,
            max: 1000,
        };

        const { container } = render(
            <AccountTransferForm
                accounts_list={accounts_list}
                account_limits={account_limits}
                mt5_login_list={mt5_login_list}
                onMount={onMount}
                resetConverter={resetConverter}
                recentTransactionOnMount={recentTransactionOnMount}
                selected_from={selected_from}
                selected_to={selected_to}
                transfer_limit={transfer_limit}
            />
        );

        expect(screen.getByText('From')).toBeInTheDocument();
        expect(screen.getByText('To')).toBeInTheDocument();
        expect(container.querySelector('.account-transfer-form__drop-down-wrapper')).toBeInTheDocument();
        expect(container.querySelector('.account-transfer-form__drop-down')).toBeInTheDocument();
        expect(container.querySelector('.account-transfer-form__drop-down--to-dropdown')).toBeInTheDocument();
        expect(container.querySelector('.account-transfer-form__form-submit')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Transfer' })).toBeInTheDocument();
    });

    it('should show an error if amount is not provided', async () => {
        const accounts_list = [1, 2, 3];
        const mt5_login_list = [];
        const onMount = jest.fn();
        const setAccountTransferAmount = jest.fn();
        const setErrorMessage = jest.fn();
        const resetConverter = jest.fn();
        const recentTransactionOnMount = jest.fn();
        const requestTransferBetweenAccounts = jest.fn();
        const transfer_limit = {
            min: 0,
            max: 1000,
        };

        const { container } = render(
            <AccountTransferForm
                accounts_list={accounts_list}
                account_limits={account_limits}
                mt5_login_list={mt5_login_list}
                onMount={onMount}
                resetConverter={resetConverter}
                recentTransactionOnMount={recentTransactionOnMount}
                requestTransferBetweenAccounts={requestTransferBetweenAccounts}
                selected_from={selected_from}
                selected_to={selected_to}
                setAccountTransferAmount={setAccountTransferAmount}
                setErrorMessage={setErrorMessage}
                transfer_limit={transfer_limit}
            />
        );

        const amount_field = container.querySelector('input[name=amount]');
        const submit_button = screen.getByRole('button', { name: 'Transfer' });
        fireEvent.change(amount_field, { target: { value: '1' } });
        fireEvent.change(amount_field, { target: { value: '' } });
        fireEvent.click(submit_button);

        await waitFor(() => {
            expect(screen.getByText('This field is required.')).toBeInTheDocument();
        });
    });

    it('should show an error if transfer amount is greater than balance', async () => {
        const accounts_list = [1, 2, 3];
        const mt5_login_list = [];
        const onMount = jest.fn();
        const setAccountTransferAmount = jest.fn();
        const setErrorMessage = jest.fn();
        const resetConverter = jest.fn();
        const recentTransactionOnMount = jest.fn();
        const requestTransferBetweenAccounts = jest.fn();
        const selected_from = { is_mt: true, balance: 100 };
        const selected_to = { is_mt: true };
        const transfer_limit = {
            min: 0,
            max: 1000,
        };

        const { container } = render(
            <AccountTransferForm
                accounts_list={accounts_list}
                account_limits={account_limits}
                mt5_login_list={mt5_login_list}
                onMount={onMount}
                resetConverter={resetConverter}
                recentTransactionOnMount={recentTransactionOnMount}
                requestTransferBetweenAccounts={requestTransferBetweenAccounts}
                selected_from={selected_from}
                selected_to={selected_to}
                setAccountTransferAmount={setAccountTransferAmount}
                setErrorMessage={setErrorMessage}
                transfer_limit={transfer_limit}
            />
        );

        const amount_field = container.querySelector('input[name=amount]');
        const submit_button = screen.getByRole('button', { name: 'Transfer' });
        fireEvent.change(amount_field, { target: { value: '200' } });
        fireEvent.click(submit_button);

        await waitFor(() => {
            expect(screen.getByText('Insufficient balance')).toBeInTheDocument();
        });
    });

    it('should show input if same currency', () => {
        const accounts_list = [1, 2, 3];
        const mt5_login_list = [];
        const onMount = jest.fn();
        const resetConverter = jest.fn();
        const recentTransactionOnMount = jest.fn();
        const selected_from = { is_mt: true, currency: 'USD' };
        const selected_to = { is_mt: true, currency: 'USD' };
        const transfer_limit = {
            min: 0,
            max: 1000,
        };

        const { container } = render(
            <AccountTransferForm
                accounts_list={accounts_list}
                account_limits={account_limits}
                mt5_login_list={mt5_login_list}
                onMount={onMount}
                resetConverter={resetConverter}
                recentTransactionOnMount={recentTransactionOnMount}
                selected_from={selected_from}
                selected_to={selected_to}
                transfer_limit={transfer_limit}
            />
        );

        expect(container.querySelector('.account-transfer-form__input')).toBeInTheDocument();
    });

    it("should show 'Please verify your identity' error if error.code is Fiat2CryptoTransferOverLimit", () => {
        const accounts_list = [1, 2, 3];
        const error = {
            code: 'Fiat2CryptoTransferOverLimit',
            message: 'testMessage',
        };
        const mt5_login_list = [];
        const onMount = jest.fn();
        const resetConverter = jest.fn();
        const recentTransactionOnMount = jest.fn();
        const transfer_limit = {
            min: 0,
            max: 1000,
        };

        render(
            <AccountTransferForm
                accounts_list={accounts_list}
                account_limits={account_limits}
                error={error}
                mt5_login_list={mt5_login_list}
                onMount={onMount}
                resetConverter={resetConverter}
                recentTransactionOnMount={recentTransactionOnMount}
                selected_from={selected_from}
                selected_to={selected_to}
                transfer_limit={transfer_limit}
            />
        );

        expect(screen.getByText('Please verify your identity')).toBeInTheDocument();
    });

    it("should show 'Cashier error' error if error.code is unexpected", () => {
        const accounts_list = [1, 2, 3];
        const error = {
            code: 'testCode',
            message: 'testMessage',
        };
        const mt5_login_list = [];
        const onMount = jest.fn();
        const resetConverter = jest.fn();
        const recentTransactionOnMount = jest.fn();
        const transfer_limit = {
            min: 0,
            max: 1000,
        };

        render(
            <AccountTransferForm
                accounts_list={accounts_list}
                account_limits={account_limits}
                error={error}
                mt5_login_list={mt5_login_list}
                onMount={onMount}
                resetConverter={resetConverter}
                recentTransactionOnMount={recentTransactionOnMount}
                selected_from={selected_from}
                selected_to={selected_to}
                transfer_limit={transfer_limit}
            />
        );

        expect(screen.getByText('Cashier Error')).toBeInTheDocument();
    });

    it('should show <AccountTransferNote /> component', () => {
        let default_window_inner_width = window.innerWidth;
        window.innerWidth = 399;

        const accounts_list = [{}];
        const mt5_login_list = [];
        const onMount = jest.fn();
        const resetConverter = jest.fn();
        const recentTransactionOnMount = jest.fn();
        const selected_from = { is_mt: true, currency: 'USD' };
        const selected_to = { is_mt: true, currency: 'USD' };
        const transfer_limit = {
            min: 0,
            max: 1000,
        };

        render(
            <AccountTransferForm
                accounts_list={accounts_list}
                account_limits={account_limits}
                mt5_login_list={mt5_login_list}
                onMount={onMount}
                resetConverter={resetConverter}
                recentTransactionOnMount={recentTransactionOnMount}
                selected_from={selected_from}
                selected_to={selected_to}
                transfer_limit={transfer_limit}
            />
        );

        expect(screen.getByText('Transfer limits may vary depending on the exchange rates.')).toBeInTheDocument();
        expect(
            screen.getByText(
                'Transfers may be unavailable due to high volatility or technical issues and when the exchange markets are closed.'
            )
        ).toBeInTheDocument();

        window.innerWidth = default_window_inner_width;
    });

    it('should show note with proper message if is_dxtrade_allowed', () => {
        let default_window_inner_width = window.innerWidth;
        window.innerWidth = 399;

        const account_limits = {
            daily_transfers: {
                mt5: {
                    allowed: 1,
                },
                dxtrade: {
                    allowed: 1,
                },
                internal: {
                    allowed: 1,
                },
            },
        };
        const accounts_list = [{}];
        const mt5_login_list = [];
        const onMount = jest.fn();
        const resetConverter = jest.fn();
        const recentTransactionOnMount = jest.fn();
        const selected_from = { is_mt: true, currency: 'USD' };
        const selected_to = { is_mt: true, currency: 'USD' };
        const transfer_limit = {
            min: 0,
            max: 1000,
        };

        render(
            <AccountTransferForm
                accounts_list={accounts_list}
                account_limits={account_limits}
                is_dxtrade_allowed
                mt5_login_list={mt5_login_list}
                onMount={onMount}
                resetConverter={resetConverter}
                recentTransactionOnMount={recentTransactionOnMount}
                selected_from={selected_from}
                selected_to={selected_to}
                transfer_limit={transfer_limit}
            />
        );

        expect(
            screen.getByText('You may transfer between your Deriv fiat, cryptocurrency, DMT5, and Deriv X accounts.')
        ).toBeInTheDocument();
        expect(
            screen.getByText(
                'Each day, you can make up to 1 transfers between your Deriv accounts, up to 1 transfers between your Deriv and DMT5 accounts, and up to 1 transfers between your Deriv and Deriv X accounts.'
            )
        ).toBeInTheDocument();

        window.innerWidth = default_window_inner_width;
    });

    it('should show note with proper message if is_dxtrade_allowed is false', () => {
        let default_window_inner_width = window.innerWidth;
        window.innerWidth = 399;

        const account_limits = {
            daily_transfers: {
                mt5: {
                    allowed: 1,
                },
                internal: {
                    allowed: 1,
                },
            },
        };

        const accounts_list = [{}];
        const mt5_login_list = [];
        const onMount = jest.fn();
        const resetConverter = jest.fn();
        const recentTransactionOnMount = jest.fn();
        const selected_from = { is_mt: true, currency: 'USD' };
        const selected_to = { is_mt: true, currency: 'USD' };
        const transfer_limit = {
            min: 0,
            max: 1000,
        };

        render(
            <AccountTransferForm
                accounts_list={accounts_list}
                account_limits={account_limits}
                is_dxtrade_allowed={false}
                mt5_login_list={mt5_login_list}
                onMount={onMount}
                resetConverter={resetConverter}
                recentTransactionOnMount={recentTransactionOnMount}
                selected_from={selected_from}
                selected_to={selected_to}
                transfer_limit={transfer_limit}
            />
        );

        expect(
            screen.getByText('You may transfer between your Deriv fiat, cryptocurrency, and DMT5 accounts.')
        ).toBeInTheDocument();
        expect(
            screen.getByText(
                'Each day, you can make up to 1 transfers between your Deriv accounts and up to 1 transfers between your Deriv and DMT5 accounts.'
            )
        ).toBeInTheDocument();

        window.innerWidth = default_window_inner_width;
    });

    it('should show proper hint about mt5 remained transfers', () => {
        let default_window_inner_width = window.innerWidth;
        window.innerWidth = 399;

        const account_limits = {
            daily_transfers: {
                mt5: {
                    available: 1,
                },
            },
        };
        const accounts_list = [{}];
        const mt5_login_list = [];
        const onMount = jest.fn();
        const resetConverter = jest.fn();
        const recentTransactionOnMount = jest.fn();
        const selected_from = { is_mt: true, currency: 'USD' };
        const selected_to = { is_mt: true, currency: 'USD' };
        const transfer_limit = {
            min: 0,
            max: 1000,
        };

        render(
            <AccountTransferForm
                accounts_list={accounts_list}
                account_limits={account_limits}
                mt5_login_list={mt5_login_list}
                onMount={onMount}
                resetConverter={resetConverter}
                recentTransactionOnMount={recentTransactionOnMount}
                selected_from={selected_from}
                selected_to={selected_to}
                transfer_limit={transfer_limit}
            />
        );

        expect(screen.getByText('You have 1 transfer remaining for today.')).toBeInTheDocument();

        window.innerWidth = default_window_inner_width;
    });

    it('should show proper hint about dxtrade remained transfers', () => {
        let default_window_inner_width = window.innerWidth;
        window.innerWidth = 399;

        const account_limits = {
            daily_transfers: {
                dxtrade: {
                    available: 1,
                },
            },
        };

        const accounts_list = [{}];
        const mt5_login_list = [];
        const onMount = jest.fn();
        const resetConverter = jest.fn();
        const recentTransactionOnMount = jest.fn();
        const selected_from = { is_dxtrade: true, currency: 'USD' };
        const selected_to = { is_dxtrade: true, currency: 'USD' };
        const transfer_limit = {
            min: 0,
            max: 1000,
        };

        render(
            <AccountTransferForm
                accounts_list={accounts_list}
                account_limits={account_limits}
                mt5_login_list={mt5_login_list}
                onMount={onMount}
                resetConverter={resetConverter}
                recentTransactionOnMount={recentTransactionOnMount}
                selected_from={selected_from}
                selected_to={selected_to}
                transfer_limit={transfer_limit}
            />
        );

        expect(screen.getByText('You have 1 transfer remaining for today.')).toBeInTheDocument();

        window.innerWidth = default_window_inner_width;
    });

    it('should show proper hint about internal remained transfers', () => {
        let default_window_inner_width = window.innerWidth;
        window.innerWidth = 399;

        const account_limits = {
            daily_transfers: {
                internal: {
                    available: 1,
                },
            },
        };

        const accounts_list = [{}];
        const mt5_login_list = [];
        const onMount = jest.fn();
        const resetConverter = jest.fn();
        const recentTransactionOnMount = jest.fn();
        const selected_from = { currency: 'USD' };
        const selected_to = { currency: 'USD' };
        const transfer_limit = {
            min: 0,
            max: 1000,
        };

        render(
            <AccountTransferForm
                accounts_list={accounts_list}
                account_limits={account_limits}
                mt5_login_list={mt5_login_list}
                onMount={onMount}
                resetConverter={resetConverter}
                recentTransactionOnMount={recentTransactionOnMount}
                selected_from={selected_from}
                selected_to={selected_to}
                transfer_limit={transfer_limit}
            />
        );

        expect(screen.getByText('You have 1 transfer remaining for today.')).toBeInTheDocument();

        window.innerWidth = default_window_inner_width;
    });

    it("should show proper AccountTransferNote if 'is_dxtrade_allowed' prop is true", () => {
        let default_window_inner_width = window.innerWidth;
        window.innerWidth = 399;

        const accounts_list = [{}];
        const mt5_login_list = [];
        const onMount = jest.fn();
        const resetConverter = jest.fn();
        const recentTransactionOnMount = jest.fn();
        const transfer_fee = 0;
        const transfer_limit = {
            min: 0,
            max: 1000,
        };

        render(
            <AccountTransferForm
                accounts_list={accounts_list}
                account_limits={account_limits}
                is_dxtrade_allowed
                mt5_login_list={mt5_login_list}
                onMount={onMount}
                resetConverter={resetConverter}
                recentTransactionOnMount={recentTransactionOnMount}
                selected_from={selected_from}
                selected_to={selected_to}
                transfer_fee={transfer_fee}
                transfer_limit={transfer_limit}
            />
        );
        expect(
            screen.getByText('You may transfer between your Deriv fiat, cryptocurrency, DMT5, and Deriv X accounts.')
        ).toBeInTheDocument();

        window.innerWidth = default_window_inner_width;
    });

    it("should show proper AccountTransferNote if 'is_dxtrade_allowed' prop is false", () => {
        let default_window_inner_width = window.innerWidth;
        window.innerWidth = 399;

        const accounts_list = [{}];
        const mt5_login_list = [];
        const onMount = jest.fn();
        const resetConverter = jest.fn();
        const recentTransactionOnMount = jest.fn();
        const transfer_fee = 0;
        const transfer_limit = {
            min: 0,
            max: 1000,
        };

        render(
            <AccountTransferForm
                accounts_list={accounts_list}
                account_limits={account_limits}
                is_dxtrade_allowed={false}
                mt5_login_list={mt5_login_list}
                onMount={onMount}
                resetConverter={resetConverter}
                recentTransactionOnMount={recentTransactionOnMount}
                selected_from={selected_from}
                selected_to={selected_to}
                transfer_fee={transfer_fee}
                transfer_limit={transfer_limit}
            />
        );
        expect(
            screen.getByText('You may transfer between your Deriv fiat, cryptocurrency, and DMT5 accounts.')
        ).toBeInTheDocument();

        window.innerWidth = default_window_inner_width;
    });

    it('should show proper note if no transfer fee and dxtrade_allowed ', () => {
        let default_window_inner_width = window.innerWidth;
        window.innerWidth = 399;

        const accounts_list = [{}];
        const mt5_login_list = [];
        const onMount = jest.fn();
        const resetConverter = jest.fn();
        const recentTransactionOnMount = jest.fn();
        const selected_from = { is_mt: true, currency: 'USD' };
        const selected_to = { is_mt: true, currency: 'USD' };
        const transfer_fee = 0;
        const transfer_limit = {
            min: 0,
            max: 1000,
        };

        render(
            <AccountTransferForm
                accounts_list={accounts_list}
                account_limits={account_limits}
                is_dxtrade_allowed
                mt5_login_list={mt5_login_list}
                onMount={onMount}
                resetConverter={resetConverter}
                recentTransactionOnMount={recentTransactionOnMount}
                selected_from={selected_from}
                selected_to={selected_to}
                transfer_fee={transfer_fee}
                transfer_limit={transfer_limit}
            />
        );
        expect(
            screen.getByText(
                'We do not charge a transfer fee for transfers in the same currency between your Deriv fiat and DMT5 accounts and between your Deriv fiat and Deriv X accounts. Please bear in mind that some transfers may not be possible.'
            )
        ).toBeInTheDocument();

        window.innerWidth = default_window_inner_width;
    });

    it('should show proper note if no transfer fee and is_dxtrade_allowed is false ', () => {
        let default_window_inner_width = window.innerWidth;
        window.innerWidth = 399;

        const accounts_list = [{}];
        const mt5_login_list = [];
        const onMount = jest.fn();
        const resetConverter = jest.fn();
        const recentTransactionOnMount = jest.fn();
        const selected_from = { is_mt: true, currency: 'USD' };
        const selected_to = { is_mt: true, currency: 'USD' };
        const transfer_fee = 0;
        const transfer_limit = {
            min: 0,
            max: 1000,
        };

        render(
            <AccountTransferForm
                accounts_list={accounts_list}
                account_limits={account_limits}
                is_dxtrade_allowed={false}
                mt5_login_list={mt5_login_list}
                onMount={onMount}
                resetConverter={resetConverter}
                recentTransactionOnMount={recentTransactionOnMount}
                selected_from={selected_from}
                selected_to={selected_to}
                transfer_fee={transfer_fee}
                transfer_limit={transfer_limit}
            />
        );
        expect(
            screen.getByText(
                'You’ll not be charged a transfer fee for transfers in the same currency between your Deriv fiat and DMT5 accounts. Please bear in mind that some transfers may not be possible.'
            )
        ).toBeInTheDocument();

        window.innerWidth = default_window_inner_width;
    });

    it('should show proper note if transfer fee is 1% and is_dxtrade_allowed ', () => {
        let default_window_inner_width = window.innerWidth;
        window.innerWidth = 399;

        const accounts_list = [{}];
        const mt5_login_list = [];
        const onMount = jest.fn();
        const resetConverter = jest.fn();
        const recentTransactionOnMount = jest.fn();
        const selected_from = { is_mt: true, currency: 'USD' };
        const selected_to = { is_mt: true, currency: 'USD' };
        const transfer_fee = 1;
        const transfer_limit = {
            min: 0,
            max: 1000,
        };

        render(
            <AccountTransferForm
                accounts_list={accounts_list}
                account_limits={account_limits}
                is_dxtrade_allowed
                mt5_login_list={mt5_login_list}
                onMount={onMount}
                resetConverter={resetConverter}
                recentTransactionOnMount={recentTransactionOnMount}
                selected_from={selected_from}
                selected_to={selected_to}
                transfer_fee={transfer_fee}
                transfer_limit={transfer_limit}
            />
        );
        expect(
            screen.getByText(
                'We’ll charge a 1% transfer fee for transfers in different currencies between your Deriv fiat and DMT5 accounts and between your Deriv fiat and Deriv X accounts. Please bear in mind that some transfers may not be possible.'
            )
        ).toBeInTheDocument();

        window.innerWidth = default_window_inner_width;
    });

    it('should show proper note if transfer fee is 1% and is_dxtrade_allowed is false ', () => {
        let default_window_inner_width = window.innerWidth;
        window.innerWidth = 399;
        const accounts_list = [{}];
        const mt5_login_list = [];
        const onMount = jest.fn();
        const resetConverter = jest.fn();
        const recentTransactionOnMount = jest.fn();
        const transfer_fee = 1;
        const transfer_limit = {
            min: 0,
            max: 1000,
        };
        const selected_from = { is_mt: true, currency: 'USD' };
        const selected_to = { is_mt: true, currency: 'USD' };

        render(
            <AccountTransferForm
                accounts_list={accounts_list}
                account_limits={account_limits}
                is_dxtrade_allowed={false}
                mt5_login_list={mt5_login_list}
                onMount={onMount}
                resetConverter={resetConverter}
                recentTransactionOnMount={recentTransactionOnMount}
                selected_from={selected_from}
                selected_to={selected_to}
                transfer_fee={transfer_fee}
                transfer_limit={transfer_limit}
            />
        );
        expect(
            screen.getByText(
                'We’ll charge a 1% transfer fee for transfers in different currencies between your Deriv fiat and DMT5 accounts. Please bear in mind that some transfers may not be possible.'
            )
        ).toBeInTheDocument();

        window.innerWidth = default_window_inner_width;
    });

    it('should show proper note if transfer fee is 2% and is_crypto_to_crypto_transfer', () => {
        let default_window_inner_width = window.innerWidth;
        window.innerWidth = 399;

        const accounts_list = [{}];
        const minimum_fee = 0;
        const mt5_login_list = [];
        const onMount = jest.fn();
        const resetConverter = jest.fn();
        const recentTransactionOnMount = jest.fn();
        const selected_from = { is_mt: true, currency: 'USD', is_crypto: true };
        const selected_to = { is_mt: true, currency: 'USD', is_crypto: true };
        const transfer_fee = 2;
        const transfer_limit = {
            min: 0,
            max: 1000,
        };

        render(
            <AccountTransferForm
                accounts_list={accounts_list}
                account_limits={account_limits}
                minimum_fee={minimum_fee}
                mt5_login_list={mt5_login_list}
                onMount={onMount}
                resetConverter={resetConverter}
                recentTransactionOnMount={recentTransactionOnMount}
                selected_from={selected_from}
                selected_to={selected_to}
                transfer_fee={transfer_fee}
                transfer_limit={transfer_limit}
            />
        );
        expect(
            screen.getByText(
                'We’ll charge a 2% transfer fee or 0 USD, whichever is higher, for transfers between your Deriv cryptocurrency accounts. Please bear in mind that some transfers may not be possible.'
            )
        ).toBeInTheDocument();

        window.innerWidth = default_window_inner_width;
    });

    it('should show proper note if transfer fee is 2%, is_mt_transfer and is_dxtrade_allowed', () => {
        let default_window_inner_width = window.innerWidth;
        window.innerWidth = 399;

        const accounts_list = [{}];
        const minimum_fee = 0;
        const mt5_login_list = [];
        const onMount = jest.fn();
        const resetConverter = jest.fn();
        const recentTransactionOnMount = jest.fn();
        const selected_from = { is_mt: true, currency: 'USD' };
        const selected_to = { is_mt: true, currency: 'USD' };
        const transfer_fee = 2;
        const transfer_limit = {
            min: 0,
            max: 1000,
        };

        render(
            <AccountTransferForm
                accounts_list={accounts_list}
                account_limits={account_limits}
                is_dxtrade_allowed
                minimum_fee={minimum_fee}
                mt5_login_list={mt5_login_list}
                onMount={onMount}
                resetConverter={resetConverter}
                recentTransactionOnMount={recentTransactionOnMount}
                selected_from={selected_from}
                selected_to={selected_to}
                transfer_fee={transfer_fee}
                transfer_limit={transfer_limit}
            />
        );

        expect(
            screen.getByText(
                'We’ll charge a 2% transfer fee or 0 USD, whichever is higher, for transfers between your Deriv cryptocurrency and DMT5 accounts and between your Deriv cryptocurrency and Deriv X accounts. Please bear in mind that some transfers may not be possible.'
            )
        ).toBeInTheDocument();

        window.innerWidth = default_window_inner_width;
    });

    it('should show proper note if transfer fee is 2%, is_mt_transfer, and is_dxtrade_allowed is false', () => {
        let default_window_inner_width = window.innerWidth;
        window.innerWidth = 399;

        const accounts_list = [{}];
        const minimum_fee = 0;
        const mt5_login_list = [];
        const onMount = jest.fn();
        const resetConverter = jest.fn();
        const recentTransactionOnMount = jest.fn();
        const selected_from = { is_mt: true, currency: 'USD' };
        const selected_to = { is_mt: true, currency: 'USD' };
        const transfer_fee = 2;
        const transfer_limit = {
            min: 0,
            max: 1000,
        };

        render(
            <AccountTransferForm
                accounts_list={accounts_list}
                account_limits={account_limits}
                is_dxtrade_allowed={false}
                minimum_fee={minimum_fee}
                mt5_login_list={mt5_login_list}
                onMount={onMount}
                resetConverter={resetConverter}
                recentTransactionOnMount={recentTransactionOnMount}
                selected_from={selected_from}
                selected_to={selected_to}
                transfer_fee={transfer_fee}
                transfer_limit={transfer_limit}
            />
        );

        expect(
            screen.getByText(
                'We’ll charge a 2% transfer fee or 0 USD, whichever is higher, for transfers between your Deriv cryptocurrency and DMT5 accounts. Please bear in mind that some transfers may not be possible.'
            )
        ).toBeInTheDocument();

        window.innerWidth = default_window_inner_width;
    });

    it('should show proper note if transfer fee is 2% and is_mt_transfer is false', () => {
        let default_window_inner_width = window.innerWidth;
        window.innerWidth = 399;

        const accounts_list = [{}];
        const minimum_fee = 0;
        const mt5_login_list = [];
        const onMount = jest.fn();
        const resetConverter = jest.fn();
        const recentTransactionOnMount = jest.fn();
        const selected_from = { is_mt: false, currency: 'USD' };
        const selected_to = { is_mt: false, currency: 'USD' };
        const transfer_fee = 2;
        const transfer_limit = {
            min: 0,
            max: 1000,
        };

        render(
            <AccountTransferForm
                accounts_list={accounts_list}
                account_limits={account_limits}
                minimum_fee={minimum_fee}
                mt5_login_list={mt5_login_list}
                onMount={onMount}
                resetConverter={resetConverter}
                recentTransactionOnMount={recentTransactionOnMount}
                selected_from={selected_from}
                selected_to={selected_to}
                transfer_fee={transfer_fee}
                transfer_limit={transfer_limit}
            />
        );

        expect(
            screen.getByText(
                'We’ll charge a 2% transfer fee or 0 USD, whichever is higher, for transfers between your Deriv fiat and Deriv cryptocurrency accounts. Please bear in mind that some transfers may not be possible.'
            )
        ).toBeInTheDocument();

        window.innerWidth = default_window_inner_width;
    });
});
