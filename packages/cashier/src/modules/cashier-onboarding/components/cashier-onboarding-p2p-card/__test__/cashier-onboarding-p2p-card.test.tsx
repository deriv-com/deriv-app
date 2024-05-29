import React from 'react';
import { mockStore } from '@deriv/stores';
import { fireEvent, render, screen } from '@testing-library/react';
import {
    useCurrentCurrencyConfig,
    useHasFiatCurrency,
    useHasP2PSupportedCurrencies,
    useIsP2PEnabled,
} from '@deriv/hooks';
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
            },
        },
    })),
}));

jest.mock('@deriv/hooks');

const MockUseCurrentCurrencyConfig = useCurrentCurrencyConfig as jest.MockedFunction<typeof useCurrentCurrencyConfig>;
const MockUseHasFiatCurrency = useHasFiatCurrency as jest.MockedFunction<typeof useHasFiatCurrency>;
const MockUseHasP2PSupportedCurrencies = useHasP2PSupportedCurrencies as jest.MockedFunction<
    typeof useHasP2PSupportedCurrencies
>;
const MockUseIsP2PEnabled = useIsP2PEnabled as jest.MockedFunction<typeof useIsP2PEnabled>;

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

        // @ts-expect-error need to come up with a way to mock the return type
        MockUseIsP2PEnabled.mockReturnValue({
            is_p2p_enabled: true,
        });

        // @ts-expect-error ne  ed to come up with a way to mock the return type
        MockUseHasP2PSupportedCurrencies.mockReturnValue({
            data: true,
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

        // @ts-expect-error need to come up with a way to mock the return type
        MockUseIsP2PEnabled.mockReturnValue({
            is_p2p_enabled: false,
        });

        // @ts-expect-error need to come up with a way to mock the return type
        MockUseHasP2PSupportedCurrencies.mockReturnValue({
            data: true,
        });

        // @ts-expect-error need to come up with a way to mock the return type
        MockUseCurrentCurrencyConfig.mockReturnValue({
            is_crypto: true,
        });

        MockUseHasFiatCurrency.mockReturnValue(false);

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

        // @ts-expect-error need to come up with a way to mock the return type
        MockUseIsP2PEnabled.mockReturnValue({
            is_p2p_enabled: true,
        });

        // @ts-expect-error need to come up with a way to mock the return type
        MockUseHasP2PSupportedCurrencies.mockReturnValue({
            data: true,
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

        // @ts-expect-error need to come up with a way to mock the return type
        MockUseIsP2PEnabled.mockReturnValue({
            is_p2p_enabled: false,
        });

        // @ts-expect-error need to come up with a way to mock the return type
        MockUseHasP2PSupportedCurrencies.mockReturnValue({
            data: false,
        });

        const wrapper = ({ children }: { children: JSX.Element }) => (
            <CashierProviders store={mock}>{children}</CashierProviders>
        );

        const { container } = render(<CashierOnboardingP2PCard />, { wrapper });

        expect(container).toBeEmptyDOMElement();
    });
});
