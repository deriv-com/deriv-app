import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import EmailVerificationModal from '../EmailVerificationModal';

jest.mock('@deriv-com/ui', () => ({
    ...jest.requireActual('@deriv-com/ui'),
    useDevice: () => ({ isMobile: false }),
}));

const mockProps = {
    isModalOpen: true,
    onRequestClose: jest.fn(),
};

describe('<EmailVerificationModal />', () => {
    it('should render the EmailVerificationModal', () => {
        render(<EmailVerificationModal {...mockProps} />);

        expect(screen.getByText('Has the buyer paid you?')).toBeInTheDocument();
        expect(
            screen.queryByText(
                /Releasing funds before receiving payment may result in losses. Check your email and follow the instructions/
            )
        ).toBeInTheDocument();
        expect(screen.queryByText('within 10 minutes', { selector: 'strong' })).toBeInTheDocument();
        expect(screen.queryByText(/to release the funds./)).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'I didn’t receive the email' })).toBeInTheDocument();
    });

    it('should show reasons if I didn’t receive the email button is clicked', () => {
        render(<EmailVerificationModal {...mockProps} />);

        const didntReceiveEmailButton = screen.getByRole('button', { name: 'I didn’t receive the email' });

        expect(
            screen.queryByText('The email is in your spam folder (sometimes things get lost there).')
        ).not.toBeInTheDocument();
        expect(
            screen.queryByText(
                'You accidentally gave us another email address (usually a work or a personal one instead of the one you meant).'
            )
        ).not.toBeInTheDocument();
        expect(
            screen.queryByText('The email address you entered had a mistake or typo (happens to the best of us).')
        ).not.toBeInTheDocument();
        expect(
            screen.queryByText(
                'We can’t deliver the email to this address (usually because of firewalls or filtering).'
            )
        ).not.toBeInTheDocument();

        userEvent.click(didntReceiveEmailButton);

        expect(
            screen.getByText('The email is in your spam folder (sometimes things get lost there).')
        ).toBeInTheDocument();
        expect(
            screen.getByText(
                'You accidentally gave us another email address (usually a work or a personal one instead of the one you meant).'
            )
        ).toBeInTheDocument();
        expect(
            screen.getByText('The email address you entered had a mistake or typo (happens to the best of us).')
        ).toBeInTheDocument();
        expect(
            screen.getByText('We can’t deliver the email to this address (usually because of firewalls or filtering).')
        ).toBeInTheDocument();
    });
});
