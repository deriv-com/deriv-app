import React from 'react';
import { mockStore } from '@deriv/stores';
import { render, screen } from '@testing-library/react';
import CashierProviders from '../../../../../cashier-providers';
import DepositCryptoSideNotes from '../deposit-crypto-side-notes';

jest.mock('@deriv/api', () => ({
    ...jest.requireActual('@deriv/api'),
    useFetch: jest.fn(() => ({
        data: {
            website_status: {
                currencies_config: {
                    BTC: { type: 'crypto', name: 'Bitcoin' },
                },
            },
        },
    })),
}));

describe('DepositCryptoSideNotes', () => {
    test('should show "Transaction status" side note', () => {
        const mock = mockStore({
            client: { currency: 'BTC' },
            modules: { cashier: { transaction_history: { setIsCryptoTransactionsVisible: jest.fn() } } },
        });

        const wrapper = ({ children }: { children: JSX.Element }) => (
            <CashierProviders store={mock}>{children}</CashierProviders>
        );
        render(<DepositCryptoSideNotes />, { wrapper });

        expect(screen.getByText('Transaction status')).toBeInTheDocument();
    });
});
