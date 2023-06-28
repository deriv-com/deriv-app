import React from 'react';
import { mockStore } from '@deriv/stores';
import { fireEvent, render, screen } from '@testing-library/react';
import CashierProviders from '../../../../../cashier-providers';
import CashierOnboardingP2PCard from '../cashier-onboarding-p2p-card';

jest.mock('react-router', () => ({
    ...jest.requireActual('react-router'),
    useHistory: () => ({ push: jest.fn() }),
}));

jest.mock('@deriv/hooks', () => ({
    ...jest.requireActual('@deriv/hooks'),
    useHasUSDCurrency: () => true,
    useIsP2PEnabled: () => ({ data: true }),
}));

describe('CashierOnboardingP2PCard', () => {
    test('should call the onClick callback when clicked', async () => {
        const mock = mockStore({
            client: {
                is_crypto: () => false,
            },
            modules: {
                cashier: {
                    general_store: {
                        setDepositTarget: jest.fn(),
                    },
                },
            },
        });

        const wrapper = ({ children }: { children: JSX.Element }) => (
            <CashierProviders store={mock}>{children}</CashierProviders>
        );
        render(<CashierOnboardingP2PCard />, { wrapper });

        const container = screen.getByTestId('dt_cashier_onboarding_card');

        fireEvent.click(container);

        expect(mock.modules.cashier.general_store.setDepositTarget).toBeCalledTimes(1);
    });
});
