import React from 'react';
import { mockStore } from '@deriv-app/stores';
import { render, screen } from '@testing-library/react';
import CashierProviders from '../../../../../cashier-providers';
import DepositFiatIframe from '../deposit-fiat-iframe';

jest.mock('@deriv-app/api', () => ({
    ...jest.requireActual('@deriv-app/api'),
    useRequest: jest.fn(() => ({
        data: { cashier: 'https://example.com' },
        mutate: jest.fn(),
    })),
}));

describe('<DepositFiatIframe />', () => {
    it('should render the loader when waiting for the response from the cashier API', () => {
        const mock = mockStore({});

        const wrapper = ({ children }: { children: JSX.Element }) => (
            <CashierProviders store={mock}>{children}</CashierProviders>
        );
        render(<DepositFiatIframe />, { wrapper });

        expect(screen.getByTestId('dt_initial_loader')).toBeInTheDocument();
    });

    it('should render the iframe once the url is received from API', () => {
        const mock = mockStore({});

        const wrapper = ({ children }: { children: JSX.Element }) => (
            <CashierProviders store={mock}>{children}</CashierProviders>
        );
        render(<DepositFiatIframe />, { wrapper });

        expect(screen.getByTestId('dt_deposit_fiat_iframe_iframe')).toBeInTheDocument();
    });
});
