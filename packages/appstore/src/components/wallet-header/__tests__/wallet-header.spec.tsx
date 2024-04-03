import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import { getStatusBadgeConfig } from '@deriv/account';
import { mockStore, StoreProvider } from '@deriv/stores';
import { TWalletAccount } from 'Types';
import WalletHeader from '..';
import { MT5_ACCOUNT_STATUS } from '@deriv/shared';
import { useMFAccountStatus } from '@deriv/hooks';

const mockedRootStore = mockStore({});

jest.mock('@deriv/account', () => ({
    ...jest.requireActual('@deriv/account'),
    getStatusBadgeConfig: jest.fn(() => ({ icon: '', text: '' })),
}));

jest.mock('@deriv/hooks', () => ({
    ...jest.requireActual('@deriv/hooks'),
    useWalletModalActionHandler: jest.fn(() => ({ setWalletModalActiveTabIndex: jest.fn(), handleAction: jest.fn() })),
    useMFAccountStatus: jest.fn(),
}));

describe('<WalletHeader />', () => {
    const default_mocked_props: TWalletAccount = {
        is_demo: false,
        currency: 'USD',
        landing_company_name: 'svg',
        balance: 10000,
        loginid: 'CRW123123',
        is_malta_wallet: false,
        is_selected: true,
        gradient_header_class: 'wallet-header__usd-bg',
        gradient_card_class: 'wallet-card__usd-bg',
        wallet_currency_type: '',
        currency_config: undefined,
        icon: '',
    };

    beforeEach(() => {
        (useMFAccountStatus as jest.Mock).mockReturnValue(null);
    });

    describe('Check currency card', () => {
        it('Should render right currency card for DEMO', () => {
            const mocked_props = { ...default_mocked_props, is_demo: true };
            render(
                <StoreProvider store={mockedRootStore}>
                    <WalletHeader wallet_account={mocked_props} />
                </StoreProvider>
            );

            expect(screen.queryByTestId(`dt_demo`)).toBeInTheDocument();
        });

        it('Should render right currency card for REAL SVG fiat', () => {
            const mocked_props = { ...default_mocked_props, currency: 'AUD' };
            render(
                <StoreProvider store={mockedRootStore}>
                    <WalletHeader wallet_account={mocked_props} />
                </StoreProvider>
            );

            expect(screen.queryByTestId(`dt_${mocked_props.currency.toLowerCase()}`)).toBeInTheDocument();
        });

        it('Should render right currency card for REAL SVG crypto', () => {
            const mocked_props = { ...default_mocked_props, currency: 'ETH' };
            render(
                <StoreProvider store={mockedRootStore}>
                    <WalletHeader wallet_account={mocked_props} />
                </StoreProvider>
            );

            expect(screen.queryByTestId(`dt_${mocked_props.currency.toLowerCase()}`)).toBeInTheDocument();
        });

        it('Should render right currency card for REAL MALTA fiat', () => {
            const mocked_props = { ...default_mocked_props, currency: 'ETH', landing_company_name: 'malta' };
            render(
                <StoreProvider store={mockedRootStore}>
                    <WalletHeader wallet_account={mocked_props} />
                </StoreProvider>
            );

            expect(screen.queryByTestId(`dt_${mocked_props.currency.toLowerCase()}`)).toBeInTheDocument();
        });
    });

    describe('Check balance', () => {
        it('Should render right balance with balance as props', () => {
            const mocked_props = {
                ...default_mocked_props,
                currency: 'EUR',
                landing_company_name: 'malta',
                balance: 2345.56,
            };
            render(
                <StoreProvider store={mockedRootStore}>
                    <WalletHeader wallet_account={mocked_props} />
                </StoreProvider>
            );

            expect(screen.getByText('2,345.56 EUR')).toBeInTheDocument();
        });

        it('Should render balance === 0.00', () => {
            const mocked_props = {
                ...default_mocked_props,
                currency: 'EUR',
                landing_company_name: 'malta',
                balance: 0,
            };
            render(
                <StoreProvider store={mockedRootStore}>
                    <WalletHeader wallet_account={mocked_props} />
                </StoreProvider>
            );

            expect(screen.queryByText(`0.00 ${mocked_props.currency}`)).toBeInTheDocument();
        });

        it('Should render badge Pending verification', () => {
            getStatusBadgeConfig.mockReturnValue({ icon: '', text: 'Pending verification' });
            (useMFAccountStatus as jest.Mock).mockReturnValue(MT5_ACCOUNT_STATUS.PENDING);

            const mocked_props = {
                ...default_mocked_props,
                currency: 'EUR',
                landing_company_name: 'malta',
                balance: 0,
            };

            const mocked_store = mockStore({
                client: {
                    loginid: 'MFW1231',
                },
                traders_hub: { is_eu_user: true },
            });

            render(
                <StoreProvider store={mocked_store}>
                    <WalletHeader wallet_account={mocked_props} />
                </StoreProvider>
            );

            expect(screen.queryByText(/Pending verification/i)).toBeInTheDocument();
            expect(screen.queryByText(/balance/i)).not.toBeInTheDocument();
        });

        it('Should render badge Verification failed', () => {
            getStatusBadgeConfig.mockReturnValue({ icon: '', text: 'Verification failed' });
            (useMFAccountStatus as jest.Mock).mockReturnValue(MT5_ACCOUNT_STATUS.FAILED);

            const mocked_props = {
                ...default_mocked_props,
                currency: 'EUR',
                landing_company_name: 'malta',
                balance: 0,
            };

            const mocked_store = mockStore({
                client: {
                    loginid: 'MFW1231',
                },
                traders_hub: { is_eu_user: true },
            });

            render(
                <StoreProvider store={mocked_store}>
                    <WalletHeader wallet_account={mocked_props} />
                </StoreProvider>
            );

            expect(screen.queryByText(/Verification failed/i)).toBeInTheDocument();
            expect(screen.queryByText(/balance/i)).not.toBeInTheDocument();
        });

        it('Should render badge Need verification', () => {
            getStatusBadgeConfig.mockReturnValue({ icon: '', text: 'Need verification' });
            (useMFAccountStatus as jest.Mock).mockReturnValue(MT5_ACCOUNT_STATUS.NEEDS_VERIFICATION);

            const mocked_props = {
                ...default_mocked_props,
                currency: 'EUR',
                landing_company_name: 'malta',
                balance: 0,
            };

            const mocked_store = mockStore({
                client: {
                    loginid: 'MFW1231',
                },
                traders_hub: { is_eu_user: true },
            });

            render(
                <StoreProvider store={mocked_store}>
                    <WalletHeader wallet_account={mocked_props} />
                </StoreProvider>
            );

            expect(screen.queryByText(/Need verification/i)).toBeInTheDocument();
            expect(screen.queryByText(/balance/i)).not.toBeInTheDocument();
        });
    });

    describe('Check buttons', () => {
        it('Buttons collapsed', () => {
            const mocked_props = {
                ...default_mocked_props,
                currency: 'EUR',
                balance: 0,
                is_selected: false,
                is_demo: true,
            };

            render(
                <StoreProvider store={mockedRootStore}>
                    <WalletHeader wallet_account={mocked_props} />
                </StoreProvider>
            );

            expect(screen.queryByRole('button', { name: /Transfer/i })).not.toBeInTheDocument();
        });

        it('Buttons uncollapsed', () => {
            const mocked_props = {
                ...default_mocked_props,
                currency: 'EUR',
                balance: 0,
                is_selected: true,
                is_demo: true,
            };

            const mocked_store = mockStore({
                client: {
                    loginid: 'CRW1231',
                },
            });

            render(
                <StoreProvider store={mocked_store}>
                    <WalletHeader wallet_account={mocked_props} />
                </StoreProvider>
            );

            expect(screen.getByRole('button', { name: /Transfer/i })).toBeInTheDocument();
        });

        it('Arrow button click and switchAccount should be called', async () => {
            const mocked_props = {
                ...default_mocked_props,
                balance: 0,
                is_selected: false,
                is_demo: true,
                loginid: 'CRW1231',
            };

            render(
                <StoreProvider store={mockedRootStore}>
                    <WalletHeader wallet_account={mocked_props} />
                </StoreProvider>
            );

            const arrow_btn = screen.getByTestId('dt_arrow');
            userEvent.click(arrow_btn);

            await waitFor(() => {
                expect(mockedRootStore.client.switchAccount).toBeCalledTimes(1);
            });
        });

        it('Check buttons for demo', () => {
            const mocked_props = {
                ...default_mocked_props,
                balance: 0,
                currency: 'EUR',
                is_demo: true,
                loginid: 'VRW123123',
            };

            const mocked_store = mockStore({
                client: {
                    loginid: 'VRW123123',
                },
            });

            render(
                <StoreProvider store={mocked_store}>
                    <WalletHeader wallet_account={mocked_props} />
                </StoreProvider>
            );

            const transfer_btn = screen.getByRole('button', { name: /Transfer/i });
            const transactions_btn = screen.getByRole('button', { name: /Transactions/i });
            const reset_btn = screen.getByRole('button', { name: /Reset balance/i });

            expect(transfer_btn).toBeInTheDocument();
            expect(transactions_btn).toBeInTheDocument();
            expect(reset_btn).toBeInTheDocument();
        });

        it('Check buttons for real', () => {
            const mocked_props = {
                ...default_mocked_props,
                balance: 1230,
                currency: 'EUR',
                loginid: 'CRW123123',
            };

            const mocked_store = mockStore({
                client: {
                    loginid: 'CRW123123',
                },
            });

            render(
                <StoreProvider store={mocked_store}>
                    <WalletHeader wallet_account={mocked_props} />
                </StoreProvider>
            );

            const deposit_btn = screen.getByRole('button', { name: /Deposit/i });
            const withdraw_btn = screen.getByRole('button', { name: /Withdraw/i });
            const transfer_btn = screen.getByRole('button', { name: /Transfer/i });
            const transactions_btn = screen.getByRole('button', { name: /Transactions/i });

            expect(deposit_btn).toBeInTheDocument();
            expect(withdraw_btn).toBeInTheDocument();
            expect(transfer_btn).toBeInTheDocument();
            expect(transactions_btn).toBeInTheDocument();
        });
    });
});
