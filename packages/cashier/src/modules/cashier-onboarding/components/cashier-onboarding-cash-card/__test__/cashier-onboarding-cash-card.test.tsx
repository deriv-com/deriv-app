import React from 'react';
import { mockStore } from '@deriv/stores';
import { fireEvent, render, screen } from '@testing-library/react';
import CashierOnboardingCashCard from '../cashier-onboarding-cash-card';
import CashierProviders from '../../../../../cashier-providers';

describe('CashierOnboardingCashCard', () => {
    test('should call the onClick callback when clicked', async () => {
        const mock = mockStore({
            client: {
                is_crypto: () => false,
            },
            modules: {
                cashier: {
                    general_store: {
                        setDepositTarget: jest.fn(),
                        setIsDeposit: jest.fn(),
                    },
                    account_prompt_dialog: {
                        shouldNavigateAfterPrompt: jest.fn(),
                    },
                },
            },
        });

        const wrapper = ({ children }: { children: JSX.Element }) => (
            <CashierProviders store={mock}>{children}</CashierProviders>
        );
        render(<CashierOnboardingCashCard />, { wrapper });

        const container = screen.getByTestId('dt_cashier_onboarding_card_container');

        fireEvent.click(container);

        expect(mock.modules.cashier.general_store.setDepositTarget).toBeCalledTimes(1);
    });
});
