import React from 'react';
import { createBrowserHistory } from 'history';
import { Router } from 'react-router';
import { fireEvent, render, screen } from '@testing-library/react';
import { routes } from '@deriv/shared';
import { ContinueTradingButton } from '../continue-trading-button';

describe('<ContinueTradingButton/>', () => {
    const history = createBrowserHistory();
    const renderWithRouter = (component: React.ReactElement) => {
        return render(<Router history={history}>{component}</Router>);
    };

    it('should render ContinueTradingButton component', () => {
        renderWithRouter(<ContinueTradingButton />);
        expect(screen.getByTestId('continue_btn_text')).toBeInTheDocument();
    });
    it('should render ContinueTradingButton component with default message', () => {
        renderWithRouter(<ContinueTradingButton />);
        expect(screen.getByText(/continue trading/i)).toBeInTheDocument();
    });
    it('should navigate to base url on clicking the text', () => {
        renderWithRouter(<ContinueTradingButton />);
        const continue_btn_text = screen.getByTestId('continue_btn_text');
        fireEvent.click(continue_btn_text);
        expect(history.location.pathname).toBe(routes.root);
    });
});
