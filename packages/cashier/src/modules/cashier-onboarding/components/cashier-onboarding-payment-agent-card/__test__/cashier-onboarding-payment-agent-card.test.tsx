import React from 'react';
import { mockStore } from '@deriv/stores';
import { fireEvent, render, screen } from '@testing-library/react';
import CashierProviders from '../../../../../cashier-providers';
import CashierOnboardingPaymentAgentCard from '../cashier-onboarding-payment-agent-card';

jest.mock('@deriv/api', () => ({
    ...jest.requireActual('@deriv/api'),
    useFetch: jest.fn(() => ({
        data: {
            paymentagent_list: {
                list: ['PA1', 'PA2'],
            },
        },
    })),
}));

describe('CashierOnboardingPaymentAgentCard', () => {
    test('should call the onClick callback when clicked', () => {
        const mock = mockStore({
            modules: {
                cashier: {
                    general_store: {
                        setDepositTarget: jest.fn(),
                        setShouldShowAllAvailableCurrencies: jest.fn(),
                    },
                },
            },
        });

        const wrapper = ({ children }: { children: JSX.Element }) => (
            <CashierProviders store={mock}>{children}</CashierProviders>
        );
        render(<CashierOnboardingPaymentAgentCard />, { wrapper });

        const container = screen.getByTestId('dt_cashier_onboarding_card');

        fireEvent.click(container);

        expect(mock.modules.cashier.general_store.setDepositTarget).toBeCalledTimes(1);
        expect(mock.modules.cashier.general_store.setShouldShowAllAvailableCurrencies).toBeCalledTimes(1);
        expect(mock.ui.openRealAccountSignup).toBeCalledTimes(1);
        expect(mock.ui.shouldNavigateAfterChooseCrypto).toBeCalledTimes(1);
    });
});
