import React from 'react';
import { useHistory } from 'react-router-dom';
import { APIProvider } from '@deriv/api';
import { fireEvent, render, screen } from '@testing-library/react';
import FiatOnRamp from '../FiatOnRamp';

jest.mock('react-router-dom', () => ({
    useHistory: jest.fn(),
}));
const mockUseHistory = useHistory as jest.Mock;

describe('FiatOnRamp', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should render FiatOnRamp component with initial contents', () => {
        render(<FiatOnRamp />);

        expect(screen.getByText(/Fiat onramp is a cashier service/)).toBeInTheDocument();
        expect(screen.getByText('Banxa')).toBeInTheDocument();
        expect(screen.getByText(/A fast and secure fiat-to-crypto payment service/)).toBeInTheDocument();
        expect(screen.getByText('Select')).toBeInTheDocument();
    });

    it('should navigate to /wallets/cashier/deposit on Back button click', () => {
        const pushMock = jest.fn();
        mockUseHistory.mockReturnValue({ push: pushMock });

        render(<FiatOnRamp />);

        fireEvent.click(screen.getByText('Back'));
        expect(pushMock).toHaveBeenCalledWith('/wallets/cashier/deposit');
    });

    it('should render FiatOnRampDisclaimer on click of the button in the provider card', () => {
        render(
            <APIProvider>
                <FiatOnRamp />
            </APIProvider>
        );

        fireEvent.click(screen.getByText('Select'));
        expect(screen.getByText('Disclaimer')).toBeInTheDocument();
        expect(
            screen.getByText(/Please note that Deriv is not responsible for the content or services provided by Banxa./)
        ).toBeInTheDocument();
    });

    it('should handle disclaimer toggle correctly', () => {
        render(
            <APIProvider>
                <FiatOnRamp />
            </APIProvider>
        );

        expect(screen.getByText('Banxa')).toBeInTheDocument();

        fireEvent.click(screen.getByText('Select'));
        expect(screen.getByText('Disclaimer')).toBeInTheDocument();
        expect(
            screen.getByText(/Please note that Deriv is not responsible for the content or services provided by Banxa./)
        ).toBeInTheDocument();

        fireEvent.click(screen.getByText('Back'));
        expect(screen.getByText('Banxa')).toBeInTheDocument();
    });
});
