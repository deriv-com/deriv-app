import React from 'react';
import { render, screen } from '@testing-library/react';
import { StoreProvider, mockStore } from '@deriv/stores';
import WithdrawalEmailVerification from '../withdrawal-email-verification';
import CashierProviders from '../../../cashier-providers';

const mockUseVerifyEmail: { has_been_sent: boolean; error: any; send: any } = {
    has_been_sent: false,
    error: undefined,
    send: jest.fn(),
};

jest.mock('@deriv/hooks', () => ({
    ...jest.requireActual('@deriv/hooks'),
    useVerifyEmail: jest.fn(() => mockUseVerifyEmail),
}));

const mock_store = mockStore({
    client: {
        currency: 'USD',
    },
    modules: {
        cashier: {
            transaction_history: {
                onMount: jest.fn(),
            },
        },
    },
});

const wrapper = ({ children }: { children: JSX.Element }) => {
    return <CashierProviders store={mock_store}>{children}</CashierProviders>;
};

describe('<WithdrawalEmailVerification />', () => {
    it('should render email verification page', () => {
        render(<WithdrawalEmailVerification />, { wrapper });

        expect(screen.getByText('Please help us verify your withdrawal request.')).toBeInTheDocument();
    });
});
