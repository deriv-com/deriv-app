import React from 'react';
import { createBrowserHistory } from 'history';
import { Router } from 'react-router';
import { fireEvent, render, screen } from '@testing-library/react';
import { routes } from '@deriv/shared';
import PoaButton from '../poa-button';

describe('<PoaButton/>', () => {
    const history = createBrowserHistory();
    const renderWithRouter = (component: React.ReactElement) => {
        return render(<Router history={history}>{component}</Router>);
    };

    it('should render PoaButton component', () => {
        renderWithRouter(<PoaButton />);
        expect(screen.getByTestId('poa_button_text')).toBeInTheDocument();
    });
    it('should render PoaButton component with default message', () => {
        renderWithRouter(<PoaButton />);
        expect(screen.getByText(/submit proof of address/i)).toBeInTheDocument();
    });

    it('should render custom_text passed to the component', () => {
        renderWithRouter(<PoaButton custom_text='Lorem epsom' />);
        expect(screen.getByText(/lorem epsom/i)).toBeInTheDocument();
    });

    it('should navigate to proof_of_address page on clicking the text', () => {
        renderWithRouter(<PoaButton custom_text='Lorem epsom' />);
        const poa_button_text = screen.getByTestId('poa_button_text');
        fireEvent.click(poa_button_text);
        expect(history.location.pathname).toBe(routes.proof_of_address);
    });
});
