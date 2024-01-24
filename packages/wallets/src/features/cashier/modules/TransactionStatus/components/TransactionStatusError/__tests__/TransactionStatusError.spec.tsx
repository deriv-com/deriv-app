import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import TransactionStatusError from '../TransactionStatusError';

describe('TransactionStatusError', () => {
    it('should render component correctly', () => {
        const mockRefresh = jest.fn();

        render(<TransactionStatusError refresh={mockRefresh} />);

        expect(screen.getByText('Unfortunately, we cannot retrieve the information at this time.')).toBeInTheDocument();
        expect(screen.getByText('Refresh')).toBeInTheDocument();
    });

    it('should render refresh function on click of refresh button', () => {
        const mockRefresh = jest.fn();

        render(<TransactionStatusError refresh={mockRefresh} />);

        expect(screen.getByText('Unfortunately, we cannot retrieve the information at this time.')).toBeInTheDocument();

        const refreshButton = screen.getByText('Refresh');
        expect(refreshButton).toBeInTheDocument();

        fireEvent.click(refreshButton);
        expect(mockRefresh).toHaveBeenCalledTimes(1);
    });
});
