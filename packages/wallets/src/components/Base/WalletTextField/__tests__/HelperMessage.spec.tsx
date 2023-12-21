import React from 'react';
import { render, screen } from '@testing-library/react';
import HelperMessage, { HelperMessageProps } from '../HelperMessage';

describe('HelperMessage', () => {
    const renderHelperMessage = (props: HelperMessageProps) => {
        render(<HelperMessage {...props} />);
    };

    it('should render without errors and display message when provided', () => {
        const message = 'This is a test message';
        renderHelperMessage({ message });
        expect(screen.getByText(message)).toBeInTheDocument();
    });

    it('should display error message when isError is true', () => {
        const errorMessage = 'This is an error message';
        renderHelperMessage({ isError: true, message: errorMessage });
        expect(screen.getByText(errorMessage)).toBeInTheDocument();
    });

    it('should display character count when maxLength is provided', () => {
        const maxLength = 10;
        const inputValue = '1234567890';
        renderHelperMessage({ inputValue, maxLength });
        expect(screen.getByText(`${inputValue.length} / ${maxLength}`)).toBeInTheDocument();
    });

    it('should display 0 as character count when inputValue is not provided', () => {
        const maxLength = 10;
        renderHelperMessage({ maxLength });
        expect(screen.getByText(`0 / ${maxLength}`)).toBeInTheDocument();
    });
});
