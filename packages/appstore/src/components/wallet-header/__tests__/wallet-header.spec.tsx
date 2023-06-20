import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import { mockStore, StoreProvider } from '@deriv/stores';
import WalletHeader from '..';

const mockedRootStore = mockStore({});

jest.mock('@deriv/account', () => ({
    ...jest.requireActual('@deriv/account'),
    getStatusBadgeConfig: jest.fn(() => ({ icon: '', text: '' })),
}));

describe('<WalletHeader />', () => {
    describe('Check currency card', () => {
        it('Should render right currency card for DEMO', () => {
            const mocked_data = {
                is_demo: true,
                currency: 'USD',
                landing_company_name: 'svg',
                balance: 10000,
                loginid: 'CR123123',
                landing_company_shortcode: 'svg',
            };
            render(
                <StoreProvider store={mockedRootStore}>
                    <WalletHeader wallet_account={mocked_data} />
                </StoreProvider>
            );
            const currency_card = screen.queryByTestId(`dt_demo`);

            expect(currency_card).toBeInTheDocument();
        });

        it('Should render right currency card for REAL SVG fiat', () => {
            const mocked_data = {
                is_demo: false,
                currency: 'AUD',
                landing_company_name: 'svg',
                balance: 10000,
                loginid: 'CR123123',
                landing_company_shortcode: 'svg',
            };
            render(
                <StoreProvider store={mockedRootStore}>
                    <WalletHeader wallet_account={mocked_data} />
                </StoreProvider>
            );
            const currency_card = screen.queryByTestId(`dt_${mocked_data.currency.toLowerCase()}`);

            expect(currency_card).toBeInTheDocument();
        });

        it('Should render right currency card for REAL SVG crypto', () => {
            const mocked_data = {
                is_demo: false,
                currency: 'ETH',
                landing_company_name: 'svg',
                balance: 10000,
                loginid: 'CR123123',
                landing_company_shortcode: 'svg',
            };
            render(
                <StoreProvider store={mockedRootStore}>
                    <WalletHeader wallet_account={mocked_data} />
                </StoreProvider>
            );
            const currency_card = screen.queryByTestId(`dt_${mocked_data.currency.toLowerCase()}`);

            expect(currency_card).toBeInTheDocument();
        });

        it('Should render right currency card for REAL MALTA fiat', () => {
            const mocked_data = {
                is_demo: false,
                currency: 'EUR',
                landing_company_name: 'malta',
                balance: 10000,
                loginid: 'CR123123',
                landing_company_shortcode: 'malta',
            };
            render(
                <StoreProvider store={mockedRootStore}>
                    <WalletHeader wallet_account={mocked_data} />
                </StoreProvider>
            );
            const currency_card = screen.queryByTestId(`dt_${mocked_data.currency.toLowerCase()}`);

            expect(currency_card).toBeInTheDocument();
        });
    });

    describe('Check balance', () => {
        it('Should render right balance with balance as props', () => {
            const mocked_data = {
                is_demo: false,
                currency: 'EUR',
                landing_company_name: 'malta',
                balance: 2345.56,
                loginid: 'CR123123',
                landing_company_shortcode: 'malta',
            };
            render(
                <StoreProvider store={mockedRootStore}>
                    <WalletHeader wallet_account={mocked_data} />
                </StoreProvider>
            );
            const balance_label = screen.getByText('2,345.56 EUR');

            expect(balance_label).toBeInTheDocument();
        });

        it('Should render balance === 0.00', () => {
            const mocked_data = {
                is_demo: false,
                currency: 'EUR',
                landing_company_name: 'malta',
                balance: 0,
                loginid: 'CR123123',
                landing_company_shortcode: 'malta',
            };
            render(
                <StoreProvider store={mockedRootStore}>
                    <WalletHeader wallet_account={mocked_data} />
                </StoreProvider>
            );
            const balance_label = screen.queryByText(`0.00 ${mocked_data.currency}`);

            expect(balance_label).toBeInTheDocument();
        });
    });

    describe('Check buttons', () => {
        it('Buttons collapsed', () => {
            const mocked_data = {
                is_demo: true,
                currency: 'EUR',
                landing_company_name: 'svg',
                balance: 0,
                loginid: 'CR123123',
                landing_company_shortcode: 'svg',
            };
            render(
                <StoreProvider store={mockedRootStore}>
                    <WalletHeader wallet_account={mocked_data} />
                </StoreProvider>
            );

            const btn_text = screen.queryByText(/Transfer/i);

            expect(btn_text).not.toBeInTheDocument();
        });

        it('Buttons uncollapsed', () => {
            const mocked_data = {
                is_demo: true,
                currency: 'EUR',
                landing_company_name: 'svg',
                balance: 0,
                loginid: 'CRW1231',
                landing_company_shortcode: 'svg',
            };

            const mocked_store = mockStore({
                client: {
                    loginid: 'CRW1231',
                },
            });

            render(
                <StoreProvider store={mocked_store}>
                    <WalletHeader wallet_account={mocked_data} />
                </StoreProvider>
            );

            const btn_text = screen.queryByText(/Transfer/i);

            expect(btn_text).toBeInTheDocument();
        });

        it('Arrow button click and switchAccount should be called', async () => {
            const mocked_data = {
                is_demo: true,
                currency: 'EUR',
                landing_company_name: 'svg',
                balance: 0,
                loginid: 'CRW1231',
                landing_company_shortcode: 'svg',
            };

            render(
                <StoreProvider store={mockedRootStore}>
                    <WalletHeader wallet_account={mocked_data} />
                </StoreProvider>
            );

            const arrow_btn = screen.getByTestId('dt_arrow');
            userEvent.click(arrow_btn);

            await waitFor(() => {
                expect(mockedRootStore.client.switchAccount).toBeCalledTimes(1);
            });
        });

        it('Check buttons for demo', () => {
            const mocked_data = {
                is_demo: true,
                currency: 'EUR',
                landing_company_name: 'svg',
                balance: 0,
                loginid: 'VRW123123',
                landing_company_shortcode: 'svg',
            };

            const mocked_store = mockStore({
                client: {
                    loginid: 'VRW123123',
                },
            });

            render(
                <StoreProvider store={mocked_store}>
                    <WalletHeader wallet_account={mocked_data} />
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
            const mocked_data = {
                is_demo: false,
                currency: 'EUR',
                landing_company_name: 'svg',
                balance: 1230,
                loginid: 'CRW123123',
                landing_company_shortcode: 'svg',
            };

            const mocked_store = mockStore({
                client: {
                    loginid: 'CRW123123',
                },
            });

            render(
                <StoreProvider store={mocked_store}>
                    <WalletHeader wallet_account={mocked_data} />
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
