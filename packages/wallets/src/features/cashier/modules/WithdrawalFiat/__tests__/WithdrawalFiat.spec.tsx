import React from 'react';
import { useCashierFiatAddress } from '@deriv/api-v2';
import { act, render, screen, waitFor } from '@testing-library/react';
import WithdrawalFiat from '../WithdrawalFiat';

jest.mock('@deriv/api-v2', () => ({
    useCashierFiatAddress: jest.fn(),
}));

describe('<WithdrawalFiat />', () => {
    const verificationCode = 'abcd1234';
    const setError = jest.fn();

    it('should render the iframe with the withdrawal url from API response', async () => {
        (useCashierFiatAddress as jest.Mock).mockReturnValue({
            data: 'https://example.com',
            isLoading: false,
            mutateAsync: jest.fn().mockResolvedValueOnce({}),
        });

        await act(async () => {
            render(<WithdrawalFiat setError={jest.fn()} verificationCode={verificationCode} />);
            await waitFor(() => {
                expect(screen.queryByTestId('dt_wallets_loader')).not.toBeInTheDocument();
            });
            const iframe = screen.getByTestId('dt_wallets_withdrawal_fiat_iframe');
            expect(iframe).toHaveAttribute('src', 'https://example.com');
        });
    });

    it('should render the loader while the iframe is loading', () => {
        (useCashierFiatAddress as jest.Mock).mockReturnValue({
            isLoading: true,
            mutateAsync: jest.fn().mockResolvedValueOnce({}),
        });

        render(<WithdrawalFiat setError={setError} verificationCode={verificationCode} />);

        expect(screen.getByTestId('dt_wallets_loader')).toBeInTheDocument();
    });

    it('should trigger setError callback with proper arguments when there is an API error', async () => {
        const error = {
            error: {
                code: '500',
                message: 'Server Error',
            },
        };

        (useCashierFiatAddress as jest.Mock).mockReturnValue({
            isLoading: false,
            mutateAsync: jest.fn().mockRejectedValueOnce(error),
        });

        render(<WithdrawalFiat setError={setError} verificationCode={verificationCode} />);

        await waitFor(() => {
            expect(setError).toHaveBeenCalledWith(error.error);
        });
    });
});
