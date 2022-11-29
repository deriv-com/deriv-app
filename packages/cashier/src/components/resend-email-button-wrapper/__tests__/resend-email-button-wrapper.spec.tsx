import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import ResendEmailButtonWrapper from '../resend-email-button-wrapper';
import { StoreProvider } from '@deriv/stores';

describe('<ResendEmailButtonWrapper/>', () => {
    let mockRootStore;
    const mockedProps = {
        resendVerificationEmail: jest.fn(),
        is_withdrawal: true,
    };

    beforeEach(() => {
        mockRootStore = {
            modules: {
                cashier: { withdraw: { verification: { resend_timeout: 10 } } },
            },
        };
    });

    it('component should be rendered', () => {
        render(<ResendEmailButtonWrapper {...mockedProps} />, {
            wrapper: ({ children }) => <StoreProvider store={mockRootStore}>{children}</StoreProvider>,
        });

        expect(screen.getByRole('button')).toBeInTheDocument();
    });

    it('Resend button should be disabled when resend_timeout is less then 60', () => {
        render(<ResendEmailButtonWrapper {...mockedProps} />, {
            wrapper: ({ children }) => <StoreProvider store={mockRootStore}>{children}</StoreProvider>,
        });

        expect(screen.getByRole('button')).toBeDisabled();
    });

    it('Resend button should not be disabled when resend_timeout is greater then 60', () => {
        mockRootStore.modules.cashier.withdraw.verification.resend_timeout = 70;

        render(<ResendEmailButtonWrapper {...mockedProps} />, {
            wrapper: ({ children }) => <StoreProvider store={mockRootStore}>{children}</StoreProvider>,
        });

        expect(screen.getByRole('button')).toBeEnabled();
    });

    it('resendVerificationEmail function to be called when resend button is called', () => {
        mockRootStore.modules.cashier.withdraw.verification.resend_timeout = 70;

        render(<ResendEmailButtonWrapper {...mockedProps} />, {
            wrapper: ({ children }) => <StoreProvider store={mockRootStore}>{children}</StoreProvider>,
        });

        const btn = screen.getByRole('button');
        fireEvent.click(btn);

        expect(mockedProps.resendVerificationEmail).toHaveBeenCalled();
    });
});
