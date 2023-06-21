import React from 'react';
import { render, screen } from '@testing-library/react';
import { useWithdrawalEmailVerification } from '@deriv/hooks';
import WithdrawalEmailVerification from '../withdrawal-email-verification';
import { StoreProvider, mockStore } from '@deriv/stores';

jest.mock('@deriv/hooks', () => ({
    ...jest.requireActual('@deriv/hooks'),
    useVerifyEmail: jest.fn(),
    useWithdrawalEmailVerification: jest.fn(),
}));

const mock_store = mockStore({});

const mockUseWithdrawalEmailVerification = useWithdrawalEmailVerification as jest.MockedFunction<
    typeof useWithdrawalEmailVerification
>;

describe('<WithdrawalEmailVerification />', () => {
    it('should render email verification page', () => {
        mockUseWithdrawalEmailVerification.mockReturnValueOnce({
            currency: 'USD',
            transaction_history: {
                onMount: jest.fn(),
            },
            verify: { has_been_sent: false },
        });

        const wrapper = ({ children }: { children: JSX.Element }) => {
            return <StoreProvider store={mock_store}>{children}</StoreProvider>;
        };

        render(<WithdrawalEmailVerification />, { wrapper });

        expect(screen.getByText('Please help us verify your withdrawal request.')).toBeInTheDocument();
    });

    it('should render error page for failed email verification step', () => {
        mockUseWithdrawalEmailVerification.mockReturnValueOnce({
            currency: 'USD',
            transaction_history: {
                onMount: jest.fn(),
            },
            verify: {
                has_been_sent: false,
                error: {
                    code: 'InvalidToken',
                },
            },
        });

        const wrapper = ({ children }: { children: JSX.Element }) => {
            return <StoreProvider store={mock_store}>{children}</StoreProvider>;
        };

        render(<WithdrawalEmailVerification />, { wrapper });

        expect(screen.getByText('Email verification failed')).toBeInTheDocument();
    });
});
