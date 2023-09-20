import React from 'react';
import { render, screen } from '@testing-library/react';
import EmailResent from '../email-resent';

describe('EmailResent', () => {
    it('should render the component', () => {
        render(<EmailResent />);
        expect(screen.queryByText(/We've sent you an email./)).toBeInTheDocument();
        expect(screen.queryByText(/Please click on the link in the email to reset your password./)).toBeInTheDocument();
    });

    it('should display the email sent svg icon', () => {
        render(<EmailResent />);
        expect(screen.getByTestId('dt_email-resent')).toBeInTheDocument();
    });
});
