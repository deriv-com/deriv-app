import React from 'react';
import { Router } from 'react-router-dom';
import userEvent from '@testing-library/user-event';
import { createMemoryHistory } from 'history';
import { render, screen } from '@testing-library/react';
import { mockStore } from '@deriv/stores';
import { redirectToLogin, redirectToSignUp } from '@deriv/shared';
import ModulesProvider from 'Stores/Providers/modules-providers';
import TraderProviders from '../../../../trader-providers';
import Trade from '../trade';

const mock_contract_data = {
    contracts_for_company: {
        available: [{ contract_type: 'type_1' }, { contract_type: 'type_2' }, { contract_type: 'unsupported_type' }],
    },
};
const localStorage_key = 'guide_dtrader_v2';

const mockHistoryPush = jest.fn();
jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useHistory: () => ({
        push: mockHistoryPush,
    }),
}));

jest.mock('@deriv/shared', () => ({
    ...jest.requireActual('@deriv/shared'),
    redirectToLogin: jest.fn(),
    redirectToSignUp: jest.fn(),
}));

jest.mock('AppV2/Components/ClosedMarketMessage', () => jest.fn(() => <div>ClosedMarketMessage</div>));
jest.mock('AppV2/Components/CurrentSpot', () => jest.fn(() => <div>Current Spot</div>));
jest.mock('AppV2/Components/PurchaseButton', () => jest.fn(() => <div>Purchase Button</div>));
jest.mock('../trade-types', () => jest.fn(() => <div>Trade Types Selection</div>));
jest.mock('AppV2/Components/MarketSelector', () => jest.fn(() => <div>MarketSelector</div>));
jest.mock('../../Chart', () => ({
    ...jest.requireActual('../../Chart'),
    TradeChart: jest.fn(() => <div>Chart</div>),
}));
jest.mock('AppV2/Components/AccumulatorStats', () => jest.fn(() => <div>AccumulatorStats</div>));

jest.mock('AppV2/Components/TradeParameters', () => ({
    ...jest.requireActual('AppV2/Components/TradeParameters'),
    TradeParametersContainer: jest.fn(({ children }) => <div>{children}</div>),
    TradeParameters: jest.fn(() => <div>Trade Parameters</div>),
}));
jest.mock('AppV2/Utils/trade-types-utils', () => ({
    ...jest.requireActual('AppV2/Utils/trade-types-utils'),
    getTradeTypesList: jest.fn(() => ['mock_trade_type']),
}));
jest.mock('@lottiefiles/dotlottie-react', () => ({
    DotLottieReact: jest.fn(() => <div>DotLottieReact</div>),
}));
jest.mock('AppV2/Components/OnboardingGuide/GuideForPages', () => jest.fn(() => 'OnboardingGuide'));
jest.mock('AppV2/Hooks/useContractsForCompany', () => ({
    __esModule: true,
    default: jest.fn(() => ({
        is_fetching_ref: { current: false },
        trade_types: mock_contract_data.contracts_for_company.available,
    })),
}));

describe('Trade', () => {
    let default_mock_store: ReturnType<typeof mockStore>;

    const history = createMemoryHistory();
    beforeEach(() => {
        default_mock_store = mockStore({
            modules: {
                trade: {
                    active_symbols: [
                        {
                            allow_forward_starting: 0,
                            display_name: 'BTC/USD',
                            display_order: 0,
                            exchange_is_open: 1,
                            is_trading_suspended: 0,
                            market: 'cryptocurrency',
                            market_display_name: 'Cryptocurrencies',
                            pip: 0.001,
                            subgroup: 'none',
                            subgroup_display_name: 'None',
                            submarket: 'non_stable_coin',
                            submarket_display_name: 'Cryptocurrencies',
                            symbol: 'cryBTCUSD',
                            symbol_type: 'cryptocurrency',
                        },
                        {
                            allow_forward_starting: 1,
                            display_name: 'Bear Market Index',
                            display_order: 10,
                            exchange_is_open: 1,
                            is_trading_suspended: 0,
                            market: 'synthetic_index',
                            market_display_name: 'Derived',
                            pip: 0.0001,
                            subgroup: 'synthetics',
                            subgroup_display_name: 'Synthetics',
                            submarket: 'random_daily',
                            submarket_display_name: 'Daily Reset Indices',
                            symbol: 'RDBEAR',
                            symbol_type: 'stockindex',
                        },
                    ],
                },
            },
            client: { is_logged_in: true },
            common: { resetServicesError: jest.fn() },
        });
        localStorage.clear();
    });

    const mockTrade = () => {
        return (
            <Router history={history}>
                <TraderProviders store={default_mock_store}>
                    <ModulesProvider store={default_mock_store}>
                        <Trade />
                    </ModulesProvider>
                </TraderProviders>
            </Router>
        );
    };

    it('should not render the ActionSheet when there is no error', () => {
        render(mockTrade());

        expect(screen.queryByText('Insufficient balance')).not.toBeInTheDocument();
        expect(screen.queryByText('Start trading with us')).not.toBeInTheDocument();
    });

    it('should display insufficient balance message when services_error is InsufficientBalance', () => {
        default_mock_store.common.services_error = {
            code: 'InsufficientBalance',
            message: 'You do not have enough balance.',
        };
        render(mockTrade());
        expect(screen.getByText('Insufficient balance')).toBeInTheDocument();
        expect(screen.getByText('You do not have enough balance.')).toBeInTheDocument();
    });

    it('should display authorization required message when services_error is AuthorizationRequired', () => {
        default_mock_store.common.services_error = {
            code: 'AuthorizationRequired',
            message: 'You need to log in to place a trade',
            type: 'buy',
        };
        render(mockTrade());
        expect(screen.getByText('Start trading with us')).toBeInTheDocument();
        expect(screen.getByText('Log in or create a free account to place a trade.')).toBeInTheDocument();
    });

    it('should call history.push to deposit when Deposit now button is clicked', async () => {
        default_mock_store.common.services_error = {
            code: 'InsufficientBalance',
            message: 'You do not have enough balance.',
        };
        render(mockTrade());

        const depositButton = screen.getByText('Deposit now');
        await userEvent.click(depositButton);
        expect(history.location.pathname).toBe('/cashier/deposit');
    });

    it('should handle login when Login button is clicked', async () => {
        default_mock_store.common.services_error = {
            code: 'AuthorizationRequired',
            message: 'You need to log in to place a trade',
            type: 'buy',
        };

        render(mockTrade());

        const loginButton = screen.getByText('Login');
        await userEvent.click(loginButton);

        expect(redirectToLogin).toHaveBeenCalled();
    });

    it('should handle sign-up when Create free account button is clicked', async () => {
        default_mock_store.common.services_error = {
            code: 'AuthorizationRequired',
            message: 'You need to log in to place a trade',
            type: 'buy',
        };

        render(mockTrade());

        const signupButton = screen.getByText('Create free account');
        await userEvent.click(signupButton);

        expect(redirectToSignUp).toHaveBeenCalled();
    });
});
