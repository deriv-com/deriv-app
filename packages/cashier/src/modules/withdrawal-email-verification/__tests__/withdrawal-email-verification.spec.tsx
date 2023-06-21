import React from 'react';
import { render, screen } from '@testing-library/react';
import { useVerifyEmail } from '@deriv/hooks';
import WithdrawalEmailVerification from '../withdrawal-email-verification';
import { StoreProvider, mockStore } from '@deriv/stores';

jest.mock('@deriv/hooks', () => ({
    ...jest.requireActual('@deriv/hooks'),
    useVerifyEmail: jest.fn(),
}));

jest.mock('Stores/useCashierStores', () => ({
    ...jest.requireActual('Stores/useCashierStores'),
    useCashierStore: jest.fn(() => ({
        transaction_history: {
            onMount: jest.fn(),
        },
    })),
}));

const mock_store = mockStore({
    client: {
        currency: 'USD',
    },
});

const mockUseVerifyEmail = useVerifyEmail as jest.MockedFunction<typeof useVerifyEmail>;

describe('<WithdrawalEmailVerification />', () => {
    it('should render email verification page', () => {
        mockUseVerifyEmail.mockReturnValueOnce({
            has_been_sent: false,
        });

        const wrapper = ({ children }: { children: JSX.Element }) => {
            return <StoreProvider store={mock_store}>{children}</StoreProvider>;
        };

        render(<WithdrawalEmailVerification />, { wrapper });

        expect(screen.getByText('Please help us verify your withdrawal request.')).toBeInTheDocument();
    });

    it('should render error page for failed email verification step', () => {
        mockUseVerifyEmail.mockReturnValueOnce({
            has_been_sent: false,
            error: {
                code: 'InvalidToken',
            },
        });

        const wrapper = ({ children }: { children: JSX.Element }) => {
            return <StoreProvider store={mock_store}>{children}</StoreProvider>;
        };

        render(<WithdrawalEmailVerification />, { wrapper });

        expect(screen.getByText('Email verification failed')).toBeInTheDocument();
    });
});
