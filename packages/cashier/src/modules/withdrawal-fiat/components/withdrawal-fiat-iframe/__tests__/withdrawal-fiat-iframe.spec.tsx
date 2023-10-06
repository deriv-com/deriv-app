import React from 'react';
import { mockStore } from '@deriv/stores';
import { render, screen } from '@testing-library/react';
import CashierProviders from '../../../../../cashier-providers';
import WithdrawalFiatIframe from '../withdrawal-fiat-iframe';

jest.mock('@deriv/api', () => ({
    ...jest.requireActual('@deriv/api'),
    useRequest: jest.fn(() => ({
        data: { cashier: 'https://example.com' },
        mutate: jest.fn(),
    })),
}));

describe('<WithdrawalFiatIframe />', () => {
    it('should render the loader when waiting for the response from the cashier API', () => {
        const mock = mockStore({});

        const wrapper = ({ children }: { children: JSX.Element }) => (
            <CashierProviders store={mock}>{children}</CashierProviders>
        );
        render(<WithdrawalFiatIframe />, { wrapper });

        expect(screen.getByTestId('dt_initial_loader')).toBeInTheDocument();
    });

    it('should render the iframe once the url is received from API', () => {
        const mock = mockStore({});

        const wrapper = ({ children }: { children: JSX.Element }) => (
            <CashierProviders store={mock}>{children}</CashierProviders>
        );
        render(<WithdrawalFiatIframe />, { wrapper });

        expect(screen.getByTestId('dt_withdrawal_fiat_iframe_iframe')).toBeInTheDocument();
    });
});
