import React from 'react';
import { useCashierFiatAddress } from '@deriv/api-v2';
import { fireEvent, render, screen } from '@testing-library/react';
import DepositFiat from '../DepositFiat';

jest.mock('@deriv/api-v2', () => ({
    useCashierFiatAddress: jest.fn(),
}));

describe('DepositFiat', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should render loader initially', () => {
        (useCashierFiatAddress as jest.Mock).mockReturnValueOnce({
            data: null,
        });

        render(<DepositFiat />);
        expect(screen.getByTestId('dt_wallets_loader')).toBeInTheDocument();
        expect(screen.queryByTestId('dt_deposit-fiat-iframe')).not.toBeInTheDocument();
    });

    it('should display iframe correctly after onLoad event', () => {
        (useCashierFiatAddress as jest.Mock).mockReturnValue({
            data: 'https://iframe_url',
        });

        render(<DepositFiat />);

        const iframe = screen.getByTestId('dt_deposit-fiat-iframe');
        expect(iframe).toHaveAttribute('src', 'https://iframe_url');
        expect(iframe).toHaveStyle({ display: 'none' });

        fireEvent.load(iframe);
        expect(iframe).toHaveStyle({ display: 'block' });
    });
});
