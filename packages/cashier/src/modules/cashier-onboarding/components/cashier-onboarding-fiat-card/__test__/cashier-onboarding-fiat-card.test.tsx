import React from 'react';
import { mockStore } from '@deriv/stores';
import { fireEvent, render, screen } from '@testing-library/react';
import CashierProviders from '../../../../../cashier-providers';
import CashierOnboardingFiatCard from '../cashier-onboarding-fiat-card';

jest.mock('@deriv/api', () => ({
    ...jest.requireActual('@deriv/api'),
    useFetch: jest.fn(() => ({
        data: {
            website_status: {
                currencies_config: {
                    USD: { type: 'fiat', name: 'US Dollar' },
                    BTC: { type: 'crypto', name: 'Bitcoin' },
                },
            },
        },
    })),
}));

describe('CashierOnboardingFiatCard', () => {
    test('should call the onClick callback when clicked', () => {
        const mock = mockStore({
            client: {
                currency: 'USD',
            },
            modules: {
                cashier: {
                    general_store: {
                        setDepositTarget: jest.fn(),
                        setIsDeposit: jest.fn(),
                    },
                },
            },
        });

        const wrapper = ({ children }: { children: JSX.Element }) => (
            <CashierProviders store={mock}>{children}</CashierProviders>
        );
        render(<CashierOnboardingFiatCard />, { wrapper });

        const container = screen.getByTestId('dt_cashier_onboarding_card');

        fireEvent.click(container);

        expect(mock.modules.cashier.general_store.setDepositTarget).toBeCalledTimes(1);
    });
});
