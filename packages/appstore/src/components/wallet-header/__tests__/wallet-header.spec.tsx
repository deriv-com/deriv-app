import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import { mockStore, StoreProvider } from '@deriv/stores';
import WalletHeader from '..';
import { TAccountStatus } from 'Types';
import { getStatusBadgeConfig } from '@deriv/account';

const mockedRootStore = mockStore({});
const setIsOpen = jest.fn();

jest.mock('@deriv/account', () => ({
    ...jest.requireActual('@deriv/account'),
    getStatusBadgeConfig: jest.fn(() => ({ icon: '', text: '' })),
}));

describe('<WalletHeader />', () => {
    describe('Check currency card', () => {
        it('Should render right currency card for DEMO', () => {
            const account_type = 'demo';
            render(
                <StoreProvider store={mockedRootStore}>
                    <WalletHeader
                        account_type={account_type}
                        is_open_wallet={false}
                        setIsOpen={setIsOpen}
                        gradient_class='wallet-card__demo-bg'
                    />
                </StoreProvider>
            );
            const currency_card = screen.queryByTestId(`dt_demo`);

            expect(currency_card).toBeInTheDocument();
        });

        it('Should render right currency card for REAL SVG fiat', () => {
            const account_type = 'real';
            const currency = 'AUD';
            const dt_currency = currency.toLowerCase();
            render(
                <StoreProvider store={mockedRootStore}>
                    <WalletHeader
                        account_type={account_type}
                        currency={currency}
                        shortcode='svg'
                        gradient_class='wallet-card__aud-bg'
                        is_open_wallet={false}
                        setIsOpen={setIsOpen}
                    />
                </StoreProvider>
            );
            const currency_card = screen.queryByTestId(`dt_${dt_currency}`);

            expect(currency_card).toBeInTheDocument();
        });

        it('Should render right currency card for REAL SVG crypto', () => {
            const account_type = 'real';
            const currency = 'ETH';
            const dt_currency = currency.toLowerCase();
            render(
                <StoreProvider store={mockedRootStore}>
                    <WalletHeader
                        account_type={account_type}
                        currency={currency}
                        shortcode='svg'
                        gradient_class='wallet-card__eth-bg'
                        is_open_wallet={false}
                        setIsOpen={setIsOpen}
                    />
                </StoreProvider>
            );
            const currency_card = screen.queryByTestId(`dt_${dt_currency}`);

            expect(currency_card).toBeInTheDocument();
        });

        it('Should render right currency card for REAL MALTA fiat', () => {
            const account_type = 'real';
            const currency = 'EUR';
            const dt_currency = currency.toLowerCase();
            render(
                <StoreProvider store={mockedRootStore}>
                    <WalletHeader
                        account_type={account_type}
                        currency={currency}
                        shortcode='malta'
                        gradient_class='wallet-card__eur-bg'
                        is_open_wallet={false}
                        setIsOpen={setIsOpen}
                    />
                </StoreProvider>
            );
            const currency_card = screen.queryByTestId(`dt_${dt_currency}`);

            expect(currency_card).toBeInTheDocument();
        });
    });

    describe('Check balance', () => {
        it('Should render right balance with balance as props', () => {
            const account_type = 'real';
            const balance = '2345.56';
            const currency = 'EUR';
            render(
                <StoreProvider store={mockedRootStore}>
                    <WalletHeader
                        account_type={account_type}
                        balance={balance}
                        currency={currency}
                        shortcode='svg'
                        gradient_class='wallet-card__eur-bg'
                        is_open_wallet={false}
                        setIsOpen={setIsOpen}
                    />
                </StoreProvider>
            );
            const balance_label = screen.queryByText(`${balance} ${currency}`);

            expect(balance_label).toBeInTheDocument();
        });

        it('Should render balance === 0.00', () => {
            const account_type = 'real';
            const currency = 'EUR';
            render(
                <StoreProvider store={mockedRootStore}>
                    <WalletHeader
                        account_type={account_type}
                        currency={currency}
                        shortcode='svg'
                        gradient_class='wallet-card__eur-bg'
                        is_open_wallet={false}
                        setIsOpen={setIsOpen}
                    />
                </StoreProvider>
            );
            const balance_label = screen.queryByText(`0.00 ${currency}`);

            expect(balance_label).toBeInTheDocument();
        });

        it('Should render badge Pending verification', () => {
            getStatusBadgeConfig.mockReturnValue({ icon: '', text: 'Pending verification' });

            const account_status: TAccountStatus = 'pending';
            const account_type = 'real';
            const currency = 'EUR';
            render(
                <StoreProvider store={mockedRootStore}>
                    <WalletHeader
                        account_status={account_status}
                        account_type={account_type}
                        currency={currency}
                        shortcode='svg'
                        gradient_class='wallet-card__eur-bg'
                        is_open_wallet={false}
                        setIsOpen={setIsOpen}
                    />
                </StoreProvider>
            );
            const badge = screen.queryByText(/Pending verification/i);
            const balance_label = screen.queryByText(/balance/i);

            expect(badge).toBeInTheDocument();
            expect(balance_label).not.toBeInTheDocument();
        });

        it('Should render badge Verification failed', () => {
            getStatusBadgeConfig.mockReturnValue({ icon: '', text: 'Verification failed' });

            const account_status: TAccountStatus = 'pending';
            const account_type = 'real';
            const currency = 'EUR';
            render(
                <StoreProvider store={mockedRootStore}>
                    <WalletHeader
                        account_status={account_status}
                        account_type={account_type}
                        currency={currency}
                        shortcode='svg'
                        gradient_class='wallet-card__eur-bg'
                        is_open_wallet={false}
                        setIsOpen={setIsOpen}
                    />
                </StoreProvider>
            );

            const badge = screen.queryByText(/Verification failed/i);
            const balance_label = screen.queryByText(/balance/i);

            expect(badge).toBeInTheDocument();
            expect(balance_label).not.toBeInTheDocument();
        });

        it('Should render badge Need verification', () => {
            getStatusBadgeConfig.mockReturnValue({ icon: '', text: 'Need verification' });

            const account_status: TAccountStatus = 'pending';
            const account_type = 'real';
            const currency = 'EUR';
            render(
                <StoreProvider store={mockedRootStore}>
                    <WalletHeader
                        account_status={account_status}
                        account_type={account_type}
                        currency={currency}
                        shortcode='svg'
                        gradient_class='wallet-card__eur-bg'
                        is_open_wallet={false}
                        setIsOpen={setIsOpen}
                    />
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
            render(
                <StoreProvider store={mockedRootStore}>
                    <WalletHeader
                        account_type='demo'
                        is_open_wallet={false}
                        setIsOpen={setIsOpen}
                        gradient_class='wallet-card__eur-bg'
                    />
                </StoreProvider>
            );

            const btn_text = screen.queryByText(/Transfer/i);

            expect(btn_text).not.toBeInTheDocument();
        });

        it('Buttons uncollapsed', () => {
            render(
                <StoreProvider store={mockedRootStore}>
                    <WalletHeader
                        account_type='demo'
                        is_open_wallet={true}
                        setIsOpen={setIsOpen}
                        gradient_class='wallet-card__eur-bg'
                    />
                </StoreProvider>
            );

            const btn_text = screen.queryByText(/Transfer/i);

            expect(btn_text).toBeInTheDocument();
        });

        it('Arrow button click', async () => {
            const Wrapper = () => {
                const [is_open, wrapperSetIsOpen] = React.useState(false);

                return (
                    <StoreProvider store={mockedRootStore}>
                        <WalletHeader
                            account_type='demo'
                            is_open_wallet={is_open}
                            setIsOpen={wrapperSetIsOpen}
                            gradient_class='wallet-card__eur-bg'
                        />
                    </StoreProvider>
                );
            };

            render(<Wrapper />);
            const btn_text = screen.queryByText(/Transfer/i);
            const btn_arrow = screen.getByTestId('dt_arrow');

            expect(btn_text).not.toBeInTheDocument();
            await userEvent.click(btn_arrow);
            expect(screen.queryByText(/Transfer/i)).toBeInTheDocument();
        });

        it('Check buttons for demo', () => {
            render(
                <StoreProvider store={mockedRootStore}>
                    <WalletHeader
                        account_type='demo'
                        is_open_wallet={true}
                        setIsOpen={setIsOpen}
                        gradient_class='wallet-card__eur-bg'
                    />
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
            render(
                <StoreProvider store={mockedRootStore}>
                    <WalletHeader
                        account_type='real'
                        shortcode='svg'
                        gradient_class='wallet-card__usd-bg'
                        currency='USD'
                        is_open_wallet={true}
                        setIsOpen={setIsOpen}
                    />
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
