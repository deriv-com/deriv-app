import React from 'react';
import { screen, render, fireEvent, waitFor } from '@testing-library/react';
import { FundsProtection } from '../funds-protection.jsx';

jest.mock('Stores/connect', () => ({
    __esModule: true,
    default: 'mockedDefaultExport',
    connect: () => Component => Component,
}));

describe('funds-protection component tests', () => {
    it('should render the component', () => {
        render(<FundsProtection />);

        expect(screen.getByText('Funds protection level')).toBeInTheDocument();
        expect(screen.getByText('Deposit now')).toBeInTheDocument();
    });

    it('onClick function should be triggered', async () => {
        const handleClose = jest.fn();
        render(<FundsProtection submitFundsProtection={handleClose} />);

        const btn = screen.getByRole('button');
        fireEvent.click(btn);

        expect(handleClose).toHaveBeenCalledTimes(1);
    });
});
