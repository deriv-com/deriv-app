import React from 'react';
import { render, screen } from '@testing-library/react';
import FloatingRate from '../floating-rate.jsx';
import { mockStore, StoreProvider } from '@deriv/stores';
import { APIProvider } from '@deriv/api';

const wrapper = ({ children }) => (
    <APIProvider>
        <StoreProvider store={mockStore({})}>{children}</StoreProvider>
    </APIProvider>
);

describe('FloatingRate component', () => {
    it('should render default state of the component with hint message and increment, decrement buttons', () => {
        render(<FloatingRate />, { wrapper });
        expect(screen.getByText('of the market rate')).toBeInTheDocument();
        expect(screen.getAllByRole('button')).toHaveLength(2);
    });

    it('should display error messages when error is passed as props', () => {
        render(<FloatingRate error_messages='Floating rate error' />, { wrapper });
        expect(screen.getByText('Floating rate error')).toBeInTheDocument();
    });

    it('should render market rate feed based on the floating rate value passed', () => {
        render(<FloatingRate value='+2' />, { wrapper });
        expect(screen.getByText('Your rate is = 1.02')).toBeInTheDocument();
    });

    it('should render the exchange rate in hint', () => {
        render(<FloatingRate fiat_currency='AED' local_currency='INR' />, { wrapper });
        expect(screen.getByText('1 AED = 1.00')).toBeInTheDocument();
    });
});
