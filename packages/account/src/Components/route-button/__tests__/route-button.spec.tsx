import React from 'react';
import { createBrowserHistory } from 'history';
import { Router } from 'react-router';
import { fireEvent, render, screen } from '@testing-library/react';
import { routes } from '@deriv/shared';
import { RouteButton } from '../route-button';

describe('<RouteButton/>', () => {
    const history = createBrowserHistory();
    const renderWithRouter = (component: React.ReactElement) => {
        return render(<Router history={history}>{component}</Router>);
    };

    it('should render RouteButton component', () => {
        renderWithRouter(<RouteButton button_label='Test Route Button' route={routes.traders_hub} />);
        expect(screen.getByTestId('route_btn_text')).toBeInTheDocument();
        expect(screen.getByText(/Test Route Button/i)).toBeInTheDocument();
    });

    it('should navigate to route on clicking the text', () => {
        renderWithRouter(<RouteButton button_label='Test Route Button' route={routes.traders_hub} />);
        const route_btn_text = screen.getByTestId('route_btn_text');
        fireEvent.click(route_btn_text);
        expect(history.location.pathname).toBe(routes.traders_hub);
    });
});
