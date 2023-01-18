import React from 'react';
import { render, screen } from '@testing-library/react';
import FundsProtection from '../funds-protection';

describe('FundsProtection component tests', () => {
    it('should render the component', () => {
        render(<FundsProtection />);

        expect(screen.getByText('Funds protection level')).toBeInTheDocument();
        expect(screen.getByText('Deposit now')).toBeInTheDocument();
    });
});
