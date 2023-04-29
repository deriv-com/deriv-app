import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { mockStore, StoreProvider } from '@deriv/stores';
import WalletHeader from '..';
import { TAccountStatus } from 'Types';
import { getStatusBadgeConfig } from '@deriv/account';

const mocked_root_store = mockStore({});

jest.mock('@deriv/account', () => ({
    ...jest.requireActual('@deriv/account'),
    getStatusBadgeConfig: jest.fn(() => ({ icon: '', text: '' })),
}));

describe('<WalletHeader />', () => {
    describe('Check currency card', () => {
        it('Should render right currency card for DEMO', () => {
            const account_type = 'demo';
            render(
                <StoreProvider store={mocked_root_store}>
                    <WalletHeader account_type={account_type} />
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
                <StoreProvider store={mocked_root_store}>
                    <WalletHeader account_type={account_type} currency={currency} jurisdiction='svg' />
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
                <StoreProvider store={mocked_root_store}>
                    <WalletHeader account_type={account_type} currency={currency} jurisdiction='svg' />
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
                <StoreProvider store={mocked_root_store}>
                    <WalletHeader account_type={account_type} currency={currency} jurisdiction='malta' />
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
                <StoreProvider store={mocked_root_store}>
                    <WalletHeader
                        account_type={account_type}
                        balance={balance}
                        currency={currency}
                        jurisdiction='svg'
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
                <StoreProvider store={mocked_root_store}>
                    <WalletHeader account_type={account_type} currency={currency} jurisdiction='svg' />
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
                <StoreProvider store={mocked_root_store}>
                    <WalletHeader
                        account_status={account_status}
                        account_type={account_type}
                        currency={currency}
                        jurisdiction='svg'
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
                <StoreProvider store={mocked_root_store}>
                    <WalletHeader
                        account_status={account_status}
                        account_type={account_type}
                        currency={currency}
                        jurisdiction='svg'
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
                <StoreProvider store={mocked_root_store}>
                    <WalletHeader
                        account_status={account_status}
                        account_type={account_type}
                        currency={currency}
                        jurisdiction='svg'
                    />
                </StoreProvider>
            );

            const badge = screen.queryByText(/Need verification/i);
            const balance_label = screen.queryByText(/balance/i);

            expect(badge).toBeInTheDocument();
            expect(balance_label).not.toBeInTheDocument();
        });
    });
});
