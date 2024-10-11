import React from 'react';
import { routes } from '@deriv/shared';
import { mockStore } from '@deriv/stores';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import CashierProviders from '../../../../../cashier-providers';
import CashierOnboardingOnrampCard from '../cashier-onboarding-onramp-card';

jest.mock('@deriv/hooks', () => ({
    ...jest.requireActual('@deriv/hooks'),
    useCurrentCurrencyConfig: jest.fn(() => ({
        is_crypto: true,
        platform: { cashier: ['crypto'], ramp: ['banxa'] },
    })),
}));

describe('CashierOnboardingOnrampCard', () => {
    describe('user clicks on cashier onramp onboarding card', () => {
        const mock = mockStore({
            client: {
                account_list: [
                    { loginid: '1', title: 'USD' },
                    { loginid: '2', title: 'BTC' },
                ],
                available_onramp_currencies: ['ETH', 'LTC', 'BTC'],
                currency: 'BTC',
            },
            modules: {
                cashier: {
                    general_store: {
                        setDepositTarget: jest.fn(),
                    },
                },
            },
            ui: {
                openRealAccountSignup: jest.fn(),
                shouldNavigateAfterChooseCrypto: jest.fn(),
            },
        });

        it('calls the onClick callback when clicked', () => {
            const wrapper = ({ children }: { children: JSX.Element }) => (
                <CashierProviders store={mock}>{children}</CashierProviders>
            );
            render(<CashierOnboardingOnrampCard />, { wrapper });

            const container = screen.getByTestId('dt_cashier_onboarding_card');

            userEvent.click(container);

            expect(mock.modules.cashier.general_store.setDepositTarget).toHaveBeenCalledWith(routes.cashier_onramp);
        });

        it('calls `Choose account` modal and navigates to `/cashier/on-ramp` if the user has onramp supported accounts', () => {
            const wrapper = ({ children }: { children: JSX.Element }) => (
                <CashierProviders store={mock}>{children}</CashierProviders>
            );
            render(<CashierOnboardingOnrampCard />, { wrapper });

            const container = screen.getByTestId('dt_cashier_onboarding_card');

            userEvent.click(container);

            expect(mock.ui.openRealAccountSignup).toHaveBeenCalledWith('choose');
            expect(mock.ui.shouldNavigateAfterChooseCrypto).toHaveBeenCalledWith(routes.cashier_onramp);
        });

        it('calls `Create account` modal if the user does not have onramp supported accounts', () => {
            mock.client.account_list = [{ loginid: '1', title: 'USD' }];
            mock.client.currency = 'USD';

            const wrapper = ({ children }: { children: JSX.Element }) => (
                <CashierProviders store={mock}>{children}</CashierProviders>
            );
            render(<CashierOnboardingOnrampCard />, { wrapper });

            const container = screen.getByTestId('dt_cashier_onboarding_card');

            userEvent.click(container);

            expect(mock.ui.openRealAccountSignup).toHaveBeenCalledWith('add_crypto');
        });
    });
});
