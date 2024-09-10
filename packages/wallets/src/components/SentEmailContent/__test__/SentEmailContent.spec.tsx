import React, { PropsWithChildren } from 'react';
import { APIProvider, AuthProvider } from '@deriv/api-v2';
import { useDevice } from '@deriv-com/ui';
import { fireEvent, render, screen } from '@testing-library/react';
import useSendPasswordResetEmail from '../../../hooks/useSendPasswordResetEmail';
import { ModalProvider } from '../../ModalProvider';
import SentEmailContent from '../SentEmailContent';

jest.mock('../../../hooks/useSendPasswordResetEmail', () => ({
    __esModule: true,
    default: jest.fn(),
}));
jest.mock('@deriv-com/ui', () => ({
    ...jest.requireActual('@deriv-com/ui'),
    useDevice: jest.fn(() => ({
        isDesktop: true,
    })),
}));

const wrapper = ({ children }: PropsWithChildren) => (
    <APIProvider>
        <AuthProvider>
            <ModalProvider>{children}</ModalProvider>
        </AuthProvider>
    </APIProvider>
);

describe('SentEmailContent', () => {
    beforeEach(() => {
        (useDevice as jest.Mock).mockReturnValue({ isDesktop: true });
        (useSendPasswordResetEmail as jest.Mock).mockReturnValue({
            error: null,
            sendEmail: jest.fn(),
        });
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('renders default sent email content for mt5', () => {
        render(<SentEmailContent platform='mt5' />, { wrapper });

        expect(screen.getByText("We've sent you an email")).toBeInTheDocument();
        expect(
            screen.getByText('Please click on the link in the email to change your Deriv MT5 password.')
        ).toBeInTheDocument();
    });

    it('renders custom description when provided', () => {
        const customDescription = 'Example custom description';
        render(<SentEmailContent description={customDescription} platform='mt5' />, { wrapper });

        expect(screen.getByText(customDescription)).toBeInTheDocument();
    });

    it('shows additional content when button is clicked', () => {
        render(<SentEmailContent platform='mt5' />, { wrapper });

        expect(screen.getByText("Didn't receive the email?")).toBeInTheDocument();

        fireEvent.click(screen.getByText("Didn't receive the email?"));

        expect(
            screen.getByText('The email is in your spam folder (Sometimes things get lost there).')
        ).toBeInTheDocument();
        expect(
            screen.getByText(
                'You accidentally gave us another email address (Usually a work or a personal one instead of the one you meant).'
            )
        ).toBeInTheDocument();
        expect(
            screen.getByText('The email address you entered had a mistake or typo (happens to the best of us).')
        ).toBeInTheDocument();
        expect(
            screen.getByText("We can't deliver the email to this address (Usually because of firewalls or filtering).")
        ).toBeInTheDocument();
        expect(screen.getByText('Resend email')).toBeInTheDocument();
    });

    it('executes the resend email function when the button is clicked', () => {
        render(<SentEmailContent platform='mt5' />, { wrapper });

        fireEvent.click(screen.getByText("Didn't receive the email?"));
        fireEvent.click(screen.getByText('Resend email'));
        expect(useSendPasswordResetEmail).toBeCalled();
        expect(screen.getByText(/Resend email in \d+ seconds/)).toBeInTheDocument();
    });

    it('returns WalletError when it throws error', () => {
        (useSendPasswordResetEmail as jest.Mock).mockReturnValue({
            error: {
                error: {
                    code: 'error code',
                    message: 'error message',
                },
            },
        });

        render(<SentEmailContent platform='mt5' />, { wrapper });
        expect(screen.getByText('error code')).toBeInTheDocument();
        expect(screen.getByText('error message')).toBeInTheDocument();
    });
});
