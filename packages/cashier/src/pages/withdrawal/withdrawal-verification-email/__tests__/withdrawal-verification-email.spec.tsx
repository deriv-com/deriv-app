import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import WithdrawalVerificationEmail from '../withdrawal-verification-email';
import { StoreProvider } from '../../../../hooks';

jest.mock('Components/verification-email', () => jest.fn(() => 'VerificationEmail'));

describe('<WithdrawalVerificationEmail />', () => {
    let mockRootStore;
    beforeEach(() => {
        mockRootStore = {
            client: {
                cryptocurrency: 'USD',
            },
            modules: {
                cashier: {
                    transaction_history: {
                        onMount: jest.fn(),
                    },
                    withdraw: {
                        verification: {
                            is_email_sent: true,
                            sendVerificationEmail: jest.fn(),
                        },
                    },
                },
            },
        };
    });

    const renderWithdrawalVerificationEmail = () => {
        return render(
            <StoreProvider store={mockRootStore}>
                <WithdrawalVerificationEmail />
            </StoreProvider>
        );
    };

    it('component should be rendered', () => {
        renderWithdrawalVerificationEmail();

        expect(screen.getByTestId('dt_cashier_wrapper')).toBeInTheDocument();
    });

    it("<VerificationEmail /> component should be rendered when 'is_email_sent' prop is true", () => {
        renderWithdrawalVerificationEmail();

        expect(screen.getByText('VerificationEmail')).toBeInTheDocument();
    });

    it("React.Fragment should be rendered when 'is_email_sent' prop is false", () => {
        mockRootStore.modules.cashier.withdraw.verification.is_email_sent = false;
        renderWithdrawalVerificationEmail();

        expect(screen.getByText('Please help us verify your withdrawal request.')).toBeInTheDocument();
        expect(
            screen.getByText(
                "Hit the button below and we'll send you an email with a link. Click that link to verify your withdrawal request."
            )
        ).toBeInTheDocument();
        expect(screen.getByText('This is to protect your account from unauthorised withdrawals.')).toBeInTheDocument();
    });

    it("'Send email' button should be rendered when 'is_email_sent' prop is false", () => {
        mockRootStore.modules.cashier.withdraw.verification.is_email_sent = false;
        renderWithdrawalVerificationEmail();

        expect(screen.getByRole('button', { name: 'Send email' })).toBeInTheDocument();
    });

    it("sendVerificationEmail func should be triggered when click on 'Send email' button", () => {
        mockRootStore.modules.cashier.withdraw.verification.is_email_sent = false;
        renderWithdrawalVerificationEmail();

        const btn = screen.getByRole('button', { name: 'Send email' });
        fireEvent.click(btn);

        expect(mockRootStore.modules.cashier.withdraw.verification.sendVerificationEmail).toHaveBeenCalled();
    });
});
