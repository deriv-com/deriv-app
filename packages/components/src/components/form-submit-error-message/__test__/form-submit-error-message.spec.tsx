import React from 'react';
import { render, screen } from '@testing-library/react';
import FormSubmitErrorMessage from '../form-submit-error-message';

describe('<FormSubmitErrorMessage/>', () => {
    it('should render the message passed along with the icon', () => {
        render(<FormSubmitErrorMessage message='Form submit error' />);

        expect(screen.getByTestId('form_submit_error')).toBeInTheDocument();
        expect(screen.getByText('Form submit error')).toBeInTheDocument();
    });
});
