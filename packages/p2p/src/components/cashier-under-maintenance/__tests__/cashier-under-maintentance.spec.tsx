import React from 'react';
import CashierUnderMaintenance from '../cashier-under-maintenance';
import { render, screen } from '@testing-library/react';

describe('<CashierUnderMaintenance />', () => {
    it('should render the CashierUnderMaintenance', () => {
        render(<CashierUnderMaintenance />);

        expect(screen.getByText('Cashier is currently down for maintenance')).toBeInTheDocument();
        expect(screen.getByText(/Please check back in a few minutes\./s)).toBeInTheDocument();
    });
});
