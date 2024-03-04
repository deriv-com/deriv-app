import React from 'react';
import { useCashierFiatAddress } from '@deriv/api-v2';
import { act, render, screen, waitFor } from '@testing-library/react';
import WithdrawalFiat from '../WithdrawalFiat';

jest.mock('@deriv/api-v2', () => ({
    useCashierFiatAddress: jest.fn(),
}));

describe('<WithdrawalFiat />', () => {
    it('should render the iframe with the withdrawal url from API response', async () => {
        const verificationCode = 'abcd1234';
        (useCashierFiatAddress as jest.Mock).mockReturnValue({
            data: 'https://example.com',
            error: null,
            isError: false,

            isLoading: false,
            mutate: jest.fn(),
        });

        await act(async () => {
            render(<WithdrawalFiat verificationCode={verificationCode} />);
            await waitFor(() => {
                expect(screen.queryByTestId('dt_derivs-loader')).not.toBeInTheDocument();
            });
            const iframe = screen.getByTestId('dt_withdrawal_fiat_iframe');
            expect(iframe).toHaveAttribute('src', 'https://example.com');
        });
    });

    it('should render the loader while the iframe is loading', () => {
        const verificationCode = 'abcd1234';

        (useCashierFiatAddress as jest.Mock).mockReturnValue({
            isLoading: true,
            mutate: jest.fn(),
        });

        render(<WithdrawalFiat verificationCode={verificationCode} />);
        expect(screen.getByTestId('dt_derivs-loader')).toBeInTheDocument();
    });

    it('should render the error screen when server responds with error', () => {
        (useCashierFiatAddress as jest.Mock).mockReturnValue({
            error: {
                error: {
                    code: '500',
                    message: 'Server Error',
                },
            },
            isError: true,
            mutate: jest.fn(),
        });

        render(<WithdrawalFiat />);
        expect(screen.getByText('Server Error')).toBeInTheDocument();
    });
});
