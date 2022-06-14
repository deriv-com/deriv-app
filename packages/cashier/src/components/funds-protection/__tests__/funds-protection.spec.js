import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import FundsProtection from '../funds-protection';

jest.mock('Stores/connect', () => ({
    __esModule: true,
    default: 'mockedDefaultExport',
    connect: () => Component => Component,
}));

describe('FundsProtection component tests', () => {
    it('should render the component', () => {
        render(<FundsProtection />);

        expect(screen.getByText('Funds protection level')).toBeInTheDocument();
        expect(screen.getByText('Deposit now')).toBeInTheDocument();
    });

    it('onClick function should be triggered', () => {
        const handleClose = jest.fn();
        render(<FundsProtection submitFundsProtection={handleClose} />);

        const btn = screen.getByRole('button');
        fireEvent.click(btn);

        expect(handleClose).toHaveBeenCalledTimes(1);
    });
});
