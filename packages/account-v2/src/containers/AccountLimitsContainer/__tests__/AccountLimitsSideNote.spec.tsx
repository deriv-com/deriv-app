import React from 'react';
import { render, screen } from '@testing-library/react';
import { AccountLimitsSideNote } from '../AccountLimitsSideNote';

describe('AccountLimitsSideNote', () => {
    it('should render the side note component with the correct title and text', () => {
        render(<AccountLimitsSideNote />);
        const titleElement = screen.getByText('Account limits');
        const textElement = screen.getByText('These are default limits that we apply to your accounts');
        expect(titleElement).toBeInTheDocument();
        expect(textElement).toBeInTheDocument();
    });
});
