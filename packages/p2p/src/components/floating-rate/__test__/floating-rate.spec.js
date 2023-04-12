import React from 'react';
import { render, screen } from '@testing-library/react';
import FloatingRate from '../floating-rate.jsx';
import { mockStore, StoreProvider } from '@deriv/stores';

jest.mock('Stores', () => ({
    ...jest.requireActual('Stores'),
    useStores: jest.fn().mockReturnValue({
        general_store: {
            current_focus: '',
            client: { local_currency_config: { decimal_places: 2 } },
            setCurrentFocus: jest.fn(),
        },
        floating_rate_store: {
            market_rate: '100',
        },
    }),
}));

describe('<FloatingRate/>', () => {
    it('should render default state of the component with hint message and increment, decrement buttons', () => {
        render(<FloatingRate />, {
            // TODO: remove StoreProvider Wrappers when we fix routing for p2p
            wrapper: ({ children }) => <StoreProvider store={mockStore({})}>{children}</StoreProvider>,
        });

        expect(screen.getByText('of the market rate')).toBeInTheDocument();
        expect(screen.getAllByRole('button').length).toBe(2);
    });

    it('should display error messages when error is passed as props', () => {
        render(<FloatingRate error_messages='Floating rate error' />, {
            wrapper: ({ children }) => <StoreProvider store={mockStore({})}>{children}</StoreProvider>,
        });

        expect(screen.getByText('Floating rate error')).toBeInTheDocument();
    });

    it('should render market rate feed based on the floating rate value passed', () => {
        render(<FloatingRate value='+2' />, {
            wrapper: ({ children }) => <StoreProvider store={mockStore({})}>{children}</StoreProvider>,
        });

        expect(screen.getByText('Your rate is = 102.00')).toBeInTheDocument();
    });

    it('should render the exchange rate in hint', () => {
        render(<FloatingRate fiat_currency='AED' local_currency='INR' />, {
            wrapper: ({ children }) => <StoreProvider store={mockStore({})}>{children}</StoreProvider>,
        });

        expect(screen.getByText('1 AED = 100.00')).toBeInTheDocument();
    });
});
