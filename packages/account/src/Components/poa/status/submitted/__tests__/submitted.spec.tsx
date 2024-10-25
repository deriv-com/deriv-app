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
        expect(screen.getByText('Your documents were submitted successfully')).toBeInTheDocument();
    });

    it('should show submit_poi message if needs_poi is true', () => {
        renderWithRouter(<Submitted needs_poi />);
        expect(screen.getByText('You must also submit a proof of identity.')).toBeInTheDocument();
    });

    it('should show review message if needs_poi is true', () => {
        renderWithRouter(<Submitted needs_poi />);
        expect(
            screen.getByText('We’ll review your documents and notify you of its status within 1 to 3 days.')
        ).toBeInTheDocument();
    });

    it('should show ContinueTradingButton if no props are passed', () => {
        renderWithRouter(<Submitted />);
        expect(screen.getByTestId('continue-trading-button')).toBeInTheDocument();
    });
});
