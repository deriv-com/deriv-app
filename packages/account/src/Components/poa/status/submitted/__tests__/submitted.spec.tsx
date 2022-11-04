import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { screen, render } from '@testing-library/react';
import { Submitted } from '../submitted';

jest.mock('Components/poa/continue-trading-button/continue-trading-button', () => ({
    ContinueTradingButton: jest.fn(() => <div data-testid='continue-trading-button' />),
}));

describe('<Submitted />', () => {
    const renderWithRouter = (component: React.ReactNode) => {
        return render(<BrowserRouter>{component}</BrowserRouter>);
    };

    it('should render the Submitted component', () => {
        renderWithRouter(<Submitted needs_poi />);
        expect(screen.getByText('Your proof of address was submitted successfully')).toBeInTheDocument();
    });

    it('should show submit_poi message if needs_poi is true', () => {
        renderWithRouter(<Submitted needs_poi />);
        expect(screen.getByText('You must also submit a proof of identity.')).toBeInTheDocument();
    });

    it('should show review message if needs_poi is false', () => {
        renderWithRouter(<Submitted needs_poi />);
        expect(screen.getByText('Your document is being reviewed, please check back in 1-3 days.')).toBeInTheDocument();
    });

    it('should show ContinueTradingButton if needs_poi is false and is_description_enabled is false', () => {
        renderWithRouter(<Submitted needs_poi={false} is_description_enabled={false} />);
        expect(screen.getByTestId('continue-trading-button')).toBeInTheDocument();
    });
});
