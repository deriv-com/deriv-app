import React from 'react';
import { createBrowserHistory } from 'history';
import { Router } from 'react-router';
import { fireEvent, render, screen } from '@testing-library/react';
import { PoiButton } from '../poi-button';

describe('<PoiButton/>', () => {
    const history = createBrowserHistory();
    const renderWithRouter = (component: React.ReactElement) => render(<Router history={history}>{component}</Router>);

    it('should render PoiButton component', () => {
        renderWithRouter(<PoiButton />);
        expect(screen.getByText('Proof of identity')).toBeInTheDocument();
    });

    it('should navigate to proof_of_identity page after clicking', () => {
        renderWithRouter(<PoiButton />);
        const poi_button = screen.getByText('Proof of identity');
        const link = screen.getByRole('link', { current: false });
        expect(link).toHaveAttribute('href', '/account/proof-of-identity');
        fireEvent.click(poi_button);
        expect(history.location.pathname).toBe('/account/proof-of-identity');
    });
});
