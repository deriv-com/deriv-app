import React from 'react';
import { useActiveWalletAccount } from '@deriv/api-v2';
import { render, screen } from '@testing-library/react';
import TransferErrorScreen from '../TransferErrorScreen';

jest.mock('@deriv/api-v2', () => ({
    useActiveWalletAccount: jest.fn(),
}));

describe('TransferErrorScreen', () => {
    let resetError: jest.Mock;

    beforeEach(() => {
        resetError = jest.fn();
    });

    it('should show default transfer error details', () => {
        (useActiveWalletAccount as jest.Mock).mockReturnValue({ data: { currency: 'BTC' } });
        const error = {
            code: 'TransferBetweenAccountsError',
            message: 'Error message',
        };

        render(<TransferErrorScreen error={error} resetError={resetError} />);

        expect(screen.getByText('Error')).toBeInTheDocument();
        expect(screen.getByText('Error message')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Make another transfer' })).toBeInTheDocument();
    });

    it('should reset transfer errors when user clicks on button', () => {
        const error = {
            code: 'TransferBetweenAccountsError',
            message: 'Error message',
        };

        render(<TransferErrorScreen error={error} resetError={resetError} />);

        screen.getByRole('button', { name: 'Make another transfer' }).click();
        expect(resetError).toHaveBeenCalledTimes(1);
    });
});
