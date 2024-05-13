import React from 'react';
import { useHistory } from 'react-router-dom';
import { APIProvider } from '@deriv/api-v2';
import { fireEvent, render, screen } from '@testing-library/react';
import WalletsAuthProvider from '../../../../../AuthProvider';
import FiatOnRamp from '../FiatOnRamp';

jest.mock('react-router-dom', () => ({
    useHistory: jest.fn(),
}));
const mockUseHistory = useHistory as jest.Mock;

jest.mock('../components', () => ({
    FiatOnRampDisclaimer: jest.fn(({ handleDisclaimer }) => (
        <button onClick={handleDisclaimer}>Fiat OnRamp Disclaimer</button>
    )),
    FiatOnRampProviderCard: jest.fn(({ handleDisclaimer }) => (
        <button onClick={handleDisclaimer}>Fiat OnRamp Provider Card</button>
    )),
}));

describe('FiatOnRamp', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should render FiatOnRamp component with initial contents', () => {
        render(<FiatOnRamp />);

        expect(screen.getByText(/Fiat onramp is a cashier service/)).toBeInTheDocument();
        expect(screen.getByText('Fiat OnRamp Provider Card')).toBeInTheDocument();
    });

    it('should navigate to /wallet/deposit on Back button click', () => {
        const pushMock = jest.fn();
        mockUseHistory.mockReturnValue({ push: pushMock });

        render(<FiatOnRamp />);

        fireEvent.click(screen.getByText('Back'));
        expect(pushMock).toHaveBeenCalledWith('/wallet/deposit');
    });

    it('should render FiatOnRampDisclaimer on click of the button in the provider card', () => {
        render(
            <APIProvider>
                <WalletsAuthProvider>
                    <FiatOnRamp />
                </WalletsAuthProvider>
            </APIProvider>
        );

        expect(screen.getByText('Fiat OnRamp Provider Card')).toBeInTheDocument();
        fireEvent.click(screen.getByText('Fiat OnRamp Provider Card'));
        expect(screen.getByText('Fiat OnRamp Disclaimer')).toBeInTheDocument();
    });

    it('should handle disclaimer toggle correctly', () => {
        render(
            <APIProvider>
                <WalletsAuthProvider>
                    <FiatOnRamp />
                </WalletsAuthProvider>
            </APIProvider>
        );

        expect(screen.getByText('Fiat OnRamp Provider Card')).toBeInTheDocument();

        fireEvent.click(screen.getByText('Fiat OnRamp Provider Card'));
        expect(screen.getByText('Fiat OnRamp Disclaimer')).toBeInTheDocument();

        fireEvent.click(screen.getByText('Fiat OnRamp Disclaimer'));
        expect(screen.getByText('Fiat OnRamp Provider Card')).toBeInTheDocument();
    });
});
