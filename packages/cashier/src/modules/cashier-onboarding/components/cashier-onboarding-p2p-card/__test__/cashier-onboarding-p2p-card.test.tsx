import React from 'react';
import { mockStore } from '@deriv/stores';
import { fireEvent, render, screen } from '@testing-library/react';
import CashierProviders from '../../../../../cashier-providers';
import CashierOnboardingP2PCard from '../cashier-onboarding-p2p-card';

jest.mock('react-router', () => ({
    ...jest.requireActual('react-router'),
    useHistory: () => ({ push: jest.fn() }),
}));

jest.mock('@deriv/api', () => ({
    ...jest.requireActual('@deriv/api'),
    useFetch: jest.fn(() => ({
        data: {
            website_status: {
                currencies_config: {
                    USD: { type: 'fiat', name: 'US Dollar' },
                    AUD: { type: 'fiat', name: 'Australian Dollar' },
                    BTC: { type: 'crypto', name: 'Bitcoin' },
                },
                p2p_config: { supported_currencies: ['usd'] },
            },
        },
    })),
}));

describe('CashierOnboardingP2PCard', () => {
    test('should call the onClick callback when clicked', () => {
        const mock = mockStore({
            client: {
                currency: 'USD',
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

    test('should open real account signup when card is clicked', async () => {
        const mock = mockStore({
            client: {
                currency: 'BTC',
                account_list: [{ title: 'BTC' }],
                active_accounts: [{ is_virtual: 0, currency: 'USD' }],
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
            },
        });

        const wrapper = ({ children }: { children: JSX.Element }) => (
            <CashierProviders store={mock}>{children}</CashierProviders>
        );

        render(<CashierOnboardingP2PCard />, { wrapper });

        const container = screen.getByTestId('dt_cashier_onboarding_card');

        fireEvent.click(container);

        expect(mock.ui.openRealAccountSignup).toBeCalledTimes(1);
    });

    test('should call onClick callback when current currency is not crypto', async () => {
        const mock = mockStore({
            client: {
                currency: 'USD',
                account_list: [{ title: 'USD' }],
                active_accounts: [{ is_virtual: 0, currency: 'USD' }],
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

    test('should render blank element', async () => {
        const mock = mockStore({
            client: {
                currency: 'AUD',
                account_list: [{ title: 'AUD' }],
                active_accounts: [{ is_virtual: 0, currency: 'AUD' }],
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

        const { container } = render(<CashierOnboardingP2PCard />, { wrapper });

        expect(container).toBeEmptyDOMElement();
    });
});
