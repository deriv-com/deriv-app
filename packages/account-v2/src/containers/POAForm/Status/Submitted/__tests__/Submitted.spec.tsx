import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { render, screen } from '@testing-library/react';
import { Submitted } from '../Submitted';

jest.mock('Components/poa/continue-trading-button/continue-trading-button', () => ({
    ContinueTradingButton: jest.fn(() => <div data-testid='continue-trading-button' />),
}));

describe('<Submitted />', () => {
    const renderWithRouter = (component: React.ReactNode) => {
        return render(<BrowserRouter>{component}</BrowserRouter>);
    };

    it('should render the Submitted component', () => {
        renderWithRouter(<Submitted needsPOI />);
        expect(screen.getByText('Your documents were submitted successfully')).toBeInTheDocument();
    });

    it('should show submit_poi message if needsPOI is true', () => {
        renderWithRouter(<Submitted needsPOI />);
        expect(screen.getByText('You must also submit a proof of identity.')).toBeInTheDocument();
    });

    it('should show review message if needsPOI is true', () => {
        renderWithRouter(<Submitted needsPOI />);
        expect(
            screen.getByText('We’ll review your documents and notify you of its status within 1 to 3 days.')
        ).toBeInTheDocument();
    });

    it('should show ContinueTradingButton if needsPOI is false ', () => {
        renderWithRouter(<Submitted needsPOI={false} />);
        expect(screen.getByTestId('continue-trading-button')).toBeInTheDocument();
    });
});
