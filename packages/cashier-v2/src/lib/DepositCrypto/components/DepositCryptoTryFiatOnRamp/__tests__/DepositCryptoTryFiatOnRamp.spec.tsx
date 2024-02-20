import React from 'react';
import { Router } from 'react-router-dom';
import { createMemoryHistory } from 'history';
import { fireEvent, render, screen } from '@testing-library/react';
import DepositCryptoTryFiatOnRamp from '../DepositCryptoTryFiatOnRamp';

describe('DepositCryptoTryFiatOnRamp', () => {
    const history = createMemoryHistory();

    it('should render component correctly', () => {
        render(
            <Router history={history}>
                <DepositCryptoTryFiatOnRamp />
            </Router>
        );
        expect(screen.getByText(/Looking for a way to buy cryptocurrencies?/)).toBeInTheDocument();
        expect(screen.getByText('Try Fiat onramp')).toBeInTheDocument();
    });

    it('should navigate to /cashier-v2/on-ramp when the link is clicked', () => {
        render(
            <Router history={history}>
                <DepositCryptoTryFiatOnRamp />
            </Router>
        );

        fireEvent.click(screen.getByText('Try Fiat onramp'));
        expect(history.location.pathname).toEqual('/cashier-v2/on-ramp');
    });
});
