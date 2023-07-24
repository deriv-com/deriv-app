import React from 'react';
import { useHasFiatCurrency, useHasP2PSupportedCurrencies, useIsP2PEnabled } from '@deriv/hooks';
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
    useFiatAccountList: () => [{ is_virtual: 0, loginid: 'CR80128121' }],
    useHasFiatCurrency: jest.fn(() => true),
    useHasP2PSupportedCurrencies: jest.fn(() => ({ data: true })),
    useIsP2PEnabled: jest.fn(() => ({ data: true })),
}));

describe('CashierOnboardingP2PCard', () => {
    test('should call the onClick callback when clicked', () => {
        const mock = mockStore({
            client: {
                is_crypto: () => true,
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
                is_crypto: () => true,
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

        (useHasFiatCurrency as jest.Mock).mockImplementation(() => false);

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

    test('should render blank element', async () => {
        const mock = mockStore({
            client: {
                is_crypto: () => true,
            },
            modules: {
                cashier: {
                    general_store: {
                        setDepositTarget: jest.fn(),
                    },
                },
            },
        });
        (useHasP2PSupportedCurrencies as jest.Mock).mockImplementation(() => ({ data: false }));
        (useIsP2PEnabled as jest.Mock).mockImplementation(() => ({ data: false }));
        const wrapper = ({ children }: { children: JSX.Element }) => (
            <CashierProviders store={mock}>{children}</CashierProviders>
        );
        const { container } = render(<CashierOnboardingP2PCard />, { wrapper });
        expect(container).toBeEmptyDOMElement();
    });
});
