import React from 'react';
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
        render(<DepositFiat />);
        expect(screen.getByTestId('dt_wallets_loader')).toBeInTheDocument();
        expect(screen.queryByTestId('dt_deposit-fiat-iframe')).not.toBeInTheDocument();
    });

    it('should display iframe correctly after onLoad event', () => {
        render(<DepositFiat iframeUrl='https://iframe_url' />);

        const iframe = screen.getByTestId('dt_deposit-fiat-iframe');
        expect(iframe).toHaveAttribute('src', 'https://iframe_url');
        expect(iframe).toHaveStyle({ display: 'none' });

        fireEvent.load(iframe);
        expect(iframe).toHaveStyle({ display: 'block' });
    });
});
