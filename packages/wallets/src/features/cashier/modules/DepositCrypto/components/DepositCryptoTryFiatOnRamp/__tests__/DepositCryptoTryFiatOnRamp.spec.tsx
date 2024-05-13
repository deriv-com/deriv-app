import React from 'react';
import { useHistory } from 'react-router-dom';
import { fireEvent, render, screen } from '@testing-library/react';
import DepositCryptoTryFiatOnRamp from '../DepositCryptoTryFiatOnRamp';

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useHistory: jest.fn(),
}));

describe('DepositCryptoTryFiatOnRamp', () => {
    it('should render component correctly', () => {
        const mockPush = jest.fn();
        (useHistory as jest.Mock).mockReturnValue({ push: mockPush });

        render(<DepositCryptoTryFiatOnRamp />);
        expect(screen.getByText(/Looking for a way to buy cryptocurrencies?/)).toBeInTheDocument();
        expect(screen.getByText('Try Fiat onramp')).toBeInTheDocument();
    });

    it('should navigate to /wallet/on-ramp when the link is clicked', () => {
        const mockPush = jest.fn();
        (useHistory as jest.Mock).mockReturnValue({ push: mockPush });

        render(<DepositCryptoTryFiatOnRamp />);

        fireEvent.click(screen.getByText('Try Fiat onramp'));
        expect(mockPush).toHaveBeenCalledWith('/wallet/on-ramp');
    });
});
