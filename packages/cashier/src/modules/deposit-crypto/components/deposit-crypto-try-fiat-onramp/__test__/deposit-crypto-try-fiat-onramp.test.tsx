import React from 'react';
import { StoreProvider, mockStore } from '@deriv/stores';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createBrowserHistory } from 'history';
import { Router } from 'react-router';
import DepositCryptoTryFiatOnRamp from '../deposit-crypto-try-fiat-onramp';

describe('DepositCryptoTryFiatOnRamp', () => {
    test('should render correctly', () => {
        const history = createBrowserHistory();
        const mock = mockStore({});

        const wrapper = ({ children }: { children: JSX.Element }) => (
            <Router history={history}>
                <StoreProvider store={mock}>{children}</StoreProvider>
            </Router>
        );
        render(<DepositCryptoTryFiatOnRamp />, { wrapper });

        expect(screen.getByText('Looking for a way to buy cryptocurrency?')).toBeInTheDocument();
        expect(
            screen.getByText('Use our fiat onramp services to buy and deposit cryptocurrency into your Deriv account.')
        ).toBeInTheDocument();
        expect(screen.getByText('Try our Fiat onramp')).toBeInTheDocument();
    });

    test('should navigate to on-ramp page when clicked on the button', () => {
        const history = createBrowserHistory();
        const mock = mockStore({});

        const wrapper = ({ children }: { children: JSX.Element }) => (
            <Router history={history}>
                <StoreProvider store={mock}>{children}</StoreProvider>
            </Router>
        );
        render(<DepositCryptoTryFiatOnRamp />, { wrapper });

        const button = screen.getByText('Try our Fiat onramp');

        userEvent.click(button);

        expect(history.location.pathname).toBe('/cashier/on-ramp');
    });
});
