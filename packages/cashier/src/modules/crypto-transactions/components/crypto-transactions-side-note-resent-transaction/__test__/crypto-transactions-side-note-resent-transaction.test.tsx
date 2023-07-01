import React from 'react';
import { mockStore } from '@deriv/stores';
import { render, screen } from '@testing-library/react';
import CashierProviders from '../../../../../cashier-providers';
import CryptoTransactionsSideNoteResentTransaction from '../crypto-transactions-side-note-resent-transaction';

jest.mock('@deriv/api', () => ({
    ...jest.requireActual('@deriv/api'),
    useFetch: jest.fn(() => ({
        data: {
            website_status: {
                currencies_config: {
                    BTC: { type: 'crypto', name: 'Bitcoin' },
                    UST: { type: 'crypto', name: 'Tether' },
                    eUSDT: { type: 'crypto', name: 'Tether' },
                },
            },
        },
    })),
}));

describe('CryptoTransactionsSideNoteResentTransaction', () => {
    test("should show no recent transactions when user doesn't have any transactions", () => {
        const mock = mockStore({
            client: { currency: 'BTC' },
            modules: { cashier: { transaction_history: { setIsCryptoTransactionsVisible: jest.fn() } } },
        });

        const wrapper = ({ children }: { children: JSX.Element }) => (
            <CashierProviders store={mock}>{children}</CashierProviders>
        );
        render(<CryptoTransactionsSideNoteResentTransaction />, { wrapper });

        expect(screen.getByText(/No recent transactions./)).toBeInTheDocument();
    });
});
