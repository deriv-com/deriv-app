import React from 'react';
import { render, screen } from '@testing-library/react';
import { AccountLimitsSideNote } from '../AccountLimitsSideNote';

describe('AccountLimitsSideNote', () => {
    it('should render the side note component with the correct title and text', () => {
        render(<AccountLimitsSideNote />);
        expect(screen.getByText('Account limits')).toBeInTheDocument();
        expect(screen.getByText('These are default limits that we apply to your accounts')).toBeInTheDocument();
    });
});
