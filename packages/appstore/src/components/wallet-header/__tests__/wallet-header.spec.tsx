import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import { mockStore, StoreProvider } from '@deriv/stores';
import WalletHeader from '..';
import { TWalletAccount } from 'Types';
import { getStatusBadgeConfig } from '@deriv/account';

const mockedRootStore = mockStore({});

jest.mock('@deriv/account', () => ({
    ...jest.requireActual('@deriv/account'),
    getStatusBadgeConfig: jest.fn(() => ({ icon: '', text: '' })),
}));

jest.mock('@deriv/hooks', () => ({
    ...jest.requireActual('@deriv/hooks'),
    useWalletModalActionHandler: jest.fn(() => ({ setWalletModalActiveTabIndex: jest.fn(), handleAction: jest.fn() })),
}));

describe('<WalletHeader />', () => {
    let mocked_props: TWalletAccount;
    beforeEach(() => {
        mocked_props = {
            is_demo: false,
            currency: 'USD',
            landing_company_name: 'svg',
            balance: 10000,
            loginid: 'CRW123123',
            is_malta_wallet: false,
            is_selected: true,
            gradient_header_class: 'wallet-header__usd-bg',
            gradient_card_class: 'wallet-card__usd-bg',
        };
    });
    describe('Check currency card', () => {
        it('Should render right currency card for DEMO', () => {
            mocked_props.is_demo = true;
            render(
                <StoreProvider store={mockedRootStore}>
                    <WalletHeader wallet_account={mocked_props} />
                </StoreProvider>
            );
            const currency_card = screen.queryByTestId(`dt_demo`);

            expect(currency_card).toBeInTheDocument();
        });

        it('Should render right currency card for REAL SVG fiat', () => {
            mocked_props.currency = 'AUD';
            render(
                <StoreProvider store={mockedRootStore}>
                    <WalletHeader wallet_account={mocked_props} />
                </StoreProvider>
            );
            const currency_card = screen.queryByTestId(`dt_${mocked_props.currency.toLowerCase()}`);
            expect(currency_card).toBeInTheDocument();
        });

        it('Should render right currency card for REAL SVG crypto', () => {
            mocked_props.currency = 'ETH';
            render(
                <StoreProvider store={mockedRootStore}>
                    <WalletHeader wallet_account={mocked_props} />
                </StoreProvider>
            );
            const currency_card = screen.queryByTestId(`dt_${mocked_props.currency.toLowerCase()}`);

            expect(currency_card).toBeInTheDocument();
        });

        it('Should render right currency card for REAL MALTA fiat', () => {
            mocked_props.currency = 'ETH';
            mocked_props.landing_company_name = 'malta';
            render(
                <StoreProvider store={mockedRootStore}>
                    <WalletHeader wallet_account={mocked_props} />
                </StoreProvider>
            );
            const currency_card = screen.queryByTestId(`dt_${mocked_props.currency.toLowerCase()}`);

            expect(currency_card).toBeInTheDocument();
        });
    });

    describe('Check balance', () => {
        it('Should render right balance with balance as props', () => {
            mocked_props.balance = 2345.56;
            mocked_props.currency = 'EUR';
            mocked_props.landing_company_name = 'malta';
            render(
                <StoreProvider store={mockedRootStore}>
                    <WalletHeader wallet_account={mocked_props} />
                </StoreProvider>
            );
            const balance_label = screen.getByText('2,345.56 EUR');

            expect(balance_label).toBeInTheDocument();
        });

        it('Should render balance === 0.00', () => {
            mocked_props.balance = 0;
            mocked_props.currency = 'EUR';
            mocked_props.landing_company_name = 'malta';
            render(
                <StoreProvider store={mockedRootStore}>
                    <WalletHeader wallet_account={mocked_props} />
                </StoreProvider>
            );
            const balance_label = screen.queryByText(`0.00 ${mocked_props.currency}`);

            expect(balance_label).toBeInTheDocument();
        });

        it('Should render badge Pending verification', () => {
            getStatusBadgeConfig.mockReturnValue({ icon: '', text: 'Pending verification' });

            mocked_props.balance = 0;
            mocked_props.currency = 'EUR';
            mocked_props.landing_company_name = 'malta';

            const mocked_store = mockStore({
                client: {
                    loginid: 'MFW1231',
                },
                traders_hub: { multipliers_account_status: 'pending', is_eu_user: true },
            });

            render(
                <StoreProvider store={mocked_store}>
                    <WalletHeader wallet_account={mocked_props} />
                </StoreProvider>
            );

            const badge = screen.queryByText(/Pending verification/i);
            const balance_label = screen.queryByText(/balance/i);

            expect(badge).toBeInTheDocument();
            expect(balance_label).not.toBeInTheDocument();
        });

        it('Should render badge Verification failed', () => {
            getStatusBadgeConfig.mockReturnValue({ icon: '', text: 'Verification failed' });

            mocked_props.balance = 0;
            mocked_props.currency = 'EUR';
            mocked_props.landing_company_name = 'malta';

            const mocked_store = mockStore({
                client: {
                    loginid: 'MFW1231',
                },
                traders_hub: { multipliers_account_status: 'failed', is_eu_user: true },
            });

            render(
                <StoreProvider store={mocked_store}>
                    <WalletHeader wallet_account={mocked_props} />
                </StoreProvider>
            );

            const badge = screen.queryByText(/Verification failed/i);
            const balance_label = screen.queryByText(/balance/i);

            expect(badge).toBeInTheDocument();
            expect(balance_label).not.toBeInTheDocument();
        });

        it('Should render badge Need verification', () => {
            getStatusBadgeConfig.mockReturnValue({ icon: '', text: 'Need verification' });

            mocked_props.balance = 0;
            mocked_props.currency = 'EUR';
            mocked_props.landing_company_name = 'malta';

            const mocked_store = mockStore({
                client: {
                    loginid: 'MFW1231',
                },
                traders_hub: { multipliers_account_status: 'need_verification', is_eu_user: true },
            });

            render(
                <StoreProvider store={mocked_store}>
                    <WalletHeader wallet_account={mocked_props} />
                </StoreProvider>
            );

            const badge = screen.queryByText(/Need verification/i);
            const balance_label = screen.queryByText(/balance/i);

            expect(badge).toBeInTheDocument();
            expect(balance_label).not.toBeInTheDocument();
        });
    });

    describe('Check buttons', () => {
        it('Buttons collapsed', () => {
            mocked_props.is_virtual = true;
            mocked_props.currency = 'EUR';
            mocked_props.balance = 0;
            mocked_props.is_selected = false;
            render(
                <StoreProvider store={mockedRootStore}>
                    <WalletHeader wallet_account={mocked_props} />
                </StoreProvider>
            );

            const btn_text = screen.queryByText(/Transfer/i);

            expect(btn_text).not.toBeInTheDocument();
        });

        it('Buttons uncollapsed', () => {
            mocked_props.is_virtual = true;
            mocked_props.currency = 'EUR';
            mocked_props.balance = 0;
            mocked_props.loginid = 'CRW1231';
            mocked_props.is_selected = true;

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

            const btn_text = screen.queryByText(/Transfer/i);

            expect(btn_text).toBeInTheDocument();
        });

        it('Arrow button click and switchAccount should be called', async () => {
            mocked_props.is_virtual = true;
            mocked_props.currency = 'EUR';
            mocked_props.balance = 0;
            mocked_props.loginid = 'CRW1231';
            mocked_props.is_selected = false;

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
            mocked_props.is_demo = true;
            mocked_props.currency = 'EUR';
            mocked_props.balance = 0;
            mocked_props.loginid = 'VRW123123';

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

            const btn1 = screen.queryByText(/Transfer/i);
            const btn2 = screen.queryByText(/Transactions/i);
            const btn3 = screen.queryByText(/Reset balance/i);

            expect(btn1).toBeInTheDocument();
            expect(btn2).toBeInTheDocument();
            expect(btn3).toBeInTheDocument();
        });

        it('Check buttons for real', () => {
            mocked_props.currency = 'EUR';
            mocked_props.balance = 1230;
            mocked_props.loginid = 'CRW123123';

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

            const btn1 = screen.queryByText(/Deposit/i);
            const btn2 = screen.queryByText(/Withdraw/i);
            const btn3 = screen.queryByText(/Transfer/i);
            const btn4 = screen.queryByText(/Transactions/i);

            expect(btn1).toBeInTheDocument();
            expect(btn2).toBeInTheDocument();
            expect(btn3).toBeInTheDocument();
            expect(btn4).toBeInTheDocument();
        });
    });
});
