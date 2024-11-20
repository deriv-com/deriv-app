import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { mockStore } from '@deriv/stores';
import { ReportsStoreProvider } from '@deriv/reports/src/Stores/useReportsStores';
import TraderProviders from '../../../../trader-providers';
import ModulesProvider from 'Stores/Providers/modules-providers';
import { TRADE_TYPES } from '@deriv/shared';
import { Router } from 'react-router-dom';
import { createMemoryHistory } from 'history';
import TradeMobile from '../trade-mobile';

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

describe('TradeMobile', () => {
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

    const mockTradeMobile = () => {
        return (
            <Router history={history}>
                <TraderProviders store={default_mock_store}>
                    <ReportsStoreProvider>
                        <ModulesProvider store={default_mock_store}>
                            <TradeMobile />
                        </ModulesProvider>
                    </ReportsStoreProvider>
                </TraderProviders>
            </Router>
        );
    };

    it('should render loader if there is no active_symbols or contract_types_list', () => {
        default_mock_store = mockStore({});
        render(mockTradeMobile());

        expect(screen.getByTestId('dt_trade_loader')).toBeInTheDocument();
    });

    it('should render trading page with all necessary components', () => {
        render(mockTradeMobile());

        expect(screen.queryByTestId('dt_trade_loader')).not.toBeInTheDocument();
        expect(screen.queryByText('Current Spot')).not.toBeInTheDocument();
        expect(screen.queryByText('AccumulatorStats')).not.toBeInTheDocument();

        expect(screen.getByText('Trade Types Selection')).toBeInTheDocument();
        expect(screen.getByText('MarketSelector')).toBeInTheDocument();
        expect(screen.getAllByText('Trade Parameters')).toHaveLength(2);
        expect(screen.getByText('Chart')).toBeInTheDocument();
        expect(screen.getByText('Purchase Button')).toBeInTheDocument();
        expect(screen.getByText('OnboardingGuide')).toBeInTheDocument();
    });

    it('should render Current Spot  component if it is digit contract type', () => {
        default_mock_store.modules.trade.contract_type = TRADE_TYPES.EVEN_ODD;
        render(mockTradeMobile());

        expect(screen.getByText('Current Spot')).toBeInTheDocument();
    });

    it('should render AccumulatorStats if is_accumulator === true', () => {
        default_mock_store.modules.trade.is_accumulator = true;
        render(mockTradeMobile());

        expect(screen.getByText('AccumulatorStats')).toBeInTheDocument();
    });

    it('should call state setter when user scrolls', () => {
        const spySetIsMinimizedParamsVisible = jest.spyOn(React, 'useState');
        render(mockTradeMobile());

        fireEvent.scroll(screen.getByTestId('dt_trade-mobile'));

        expect(spySetIsMinimizedParamsVisible).toBeCalled();
    });

    it('should not render OnboardingGuide if localStorage flag is equal to true', () => {
        const field = { trade_page: true };
        localStorage.setItem(localStorage_key, JSON.stringify(field));
        render(mockTradeMobile());
        expect(screen.queryByText('OnboardingGuide')).not.toBeInTheDocument();
    });

    it('should not render OnboardingGuide if client is not logged in', () => {
        default_mock_store.client.is_logged_in = false;
        render(mockTradeMobile());

        expect(screen.queryByText('OnboardingGuide')).not.toBeInTheDocument();
    });
});
