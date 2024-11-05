import React from 'react';
import { render, screen } from '@testing-library/react';
import { TRADE_TYPES } from '@deriv/shared';
import { mockStore } from '@deriv/stores';
import ModulesProvider from 'Stores/Providers/modules-providers';
import TraderProviders from '../../../../trader-providers';
import { ReportsStoreProvider } from '../../../../../../reports/src/Stores/useReportsStores';
import TradeParameters from '../trade-parameters';

const TRADE_PARAMS = {
    ALLOW_EQUALS: 'AllowEquals',
    DURATION: 'Duration',
    STAKE: 'Stake',
    BARRIER: 'Barrier',
    GROWTH_RATE: 'GrowthRate',
    TAKE_PROFIT: 'TakeProfit',
    ACCUMULATORS_INFORMATION: 'AccumulatorsInformation',
    MULTIPLIER: 'Multiplier',
    RISK_MANAGEMENT: 'RiskManagement',
    MULTIPLIERS_CANCELLATION_INFO: 'MultipliersDealCancellationInfo',
    TRADE_TYPE_TABS: 'TradeTypeTabs',
    STRIKE: 'Strike',
    PAYOUT_PER_POINT: 'PayoutPerPoint',
    PAYOUT: 'payout',
    LAST_DIGIT_PREDICTION: 'LastDigitPrediction',
};
const data_test = 'dt_trade_param';

jest.mock('../AllowEquals', () => jest.fn(() => <div data-testid={data_test}>{TRADE_PARAMS.ALLOW_EQUALS}</div>));
jest.mock('../Duration', () => jest.fn(() => <div data-testid={data_test}>{TRADE_PARAMS.DURATION}</div>));
jest.mock('../Stake', () => jest.fn(() => <div data-testid={data_test}>{TRADE_PARAMS.STAKE}</div>));
jest.mock('../Barrier', () => jest.fn(() => <div data-testid={data_test}>{TRADE_PARAMS.BARRIER}</div>));
jest.mock('../GrowthRate', () => jest.fn(() => <div data-testid={data_test}>{TRADE_PARAMS.GROWTH_RATE}</div>));
jest.mock('../TakeProfit', () => jest.fn(() => <div data-testid={data_test}>{TRADE_PARAMS.TAKE_PROFIT}</div>));
jest.mock('../AccumulatorsInformation', () =>
    jest.fn(() => <div data-testid={data_test}>{TRADE_PARAMS.ACCUMULATORS_INFORMATION}</div>)
);
jest.mock('../Multiplier', () => jest.fn(() => <div data-testid={data_test}>{TRADE_PARAMS.MULTIPLIER}</div>));
jest.mock('../RiskManagement', () => jest.fn(() => <div data-testid={data_test}>{TRADE_PARAMS.RISK_MANAGEMENT}</div>));
jest.mock('../MultipliersDealCancellationInfo', () =>
    jest.fn(() => <div data-testid={data_test}>{TRADE_PARAMS.MULTIPLIERS_CANCELLATION_INFO}</div>)
);
jest.mock('../TradeTypeTabs', () => jest.fn(() => <div data-testid={data_test}>{TRADE_PARAMS.TRADE_TYPE_TABS}</div>));
jest.mock('../Strike', () => jest.fn(() => <div data-testid={data_test}>{TRADE_PARAMS.STRIKE}</div>));
jest.mock('../PayoutPerPoint', () => jest.fn(() => <div data-testid={data_test}>{TRADE_PARAMS.PAYOUT_PER_POINT}</div>));
jest.mock('../PayoutInfo', () => jest.fn(() => <div data-testid={data_test}>{TRADE_PARAMS.PAYOUT}</div>));
jest.mock('../LastDigitPrediction', () =>
    jest.fn(() => <div data-testid={data_test}>{TRADE_PARAMS.LAST_DIGIT_PREDICTION}</div>)
);

describe('TradeParameters', () => {
    let default_mock_store: ReturnType<typeof mockStore>;

    beforeEach(() => (default_mock_store = mockStore({})));

    const mockTradeParameters = () => {
        return (
            <TraderProviders store={default_mock_store}>
                <ReportsStoreProvider>
                    <ModulesProvider store={default_mock_store}>
                        <TradeParameters />
                    </ModulesProvider>
                </ReportsStoreProvider>
            </TraderProviders>
        );
    };

    it('renders correct trade params for Accumulators', () => {
        default_mock_store.modules.trade.contract_type = TRADE_TYPES.ACCUMULATOR;
        render(mockTradeParameters());

        expect(screen.getByText(TRADE_PARAMS.GROWTH_RATE)).toBeInTheDocument();
        expect(screen.getByText(TRADE_PARAMS.STAKE)).toBeInTheDocument();
        expect(screen.getByText(TRADE_PARAMS.TAKE_PROFIT)).toBeInTheDocument();
        expect(screen.getByText(TRADE_PARAMS.ACCUMULATORS_INFORMATION)).toBeInTheDocument();
        expect(screen.getAllByTestId(data_test)).toHaveLength(4);
    });

    it('renders correct trade params for Vanillas', () => {
        default_mock_store.modules.trade.contract_type = TRADE_TYPES.VANILLA.CALL;
        render(mockTradeParameters());

        expect(screen.getByText(TRADE_PARAMS.TRADE_TYPE_TABS)).toBeInTheDocument();
        expect(screen.getByText(TRADE_PARAMS.DURATION)).toBeInTheDocument();
        expect(screen.getByText(TRADE_PARAMS.STRIKE)).toBeInTheDocument();
        expect(screen.getByText(TRADE_PARAMS.STAKE)).toBeInTheDocument();
        expect(screen.getAllByTestId(data_test)).toHaveLength(4);
    });

    it('renders correct trade params for Turbos', () => {
        default_mock_store.modules.trade.contract_type = TRADE_TYPES.TURBOS.LONG;
        render(mockTradeParameters());

        expect(screen.getByText(TRADE_PARAMS.TRADE_TYPE_TABS)).toBeInTheDocument();
        expect(screen.getByText(TRADE_PARAMS.DURATION)).toBeInTheDocument();
        expect(screen.getByText(TRADE_PARAMS.PAYOUT_PER_POINT)).toBeInTheDocument();
        expect(screen.getByText(TRADE_PARAMS.STAKE)).toBeInTheDocument();
        expect(screen.getByText(TRADE_PARAMS.TAKE_PROFIT)).toBeInTheDocument();
        expect(screen.getAllByTestId(data_test)).toHaveLength(5);
    });

    it('renders correct trade params for Multipliers if has_cancellation === false', () => {
        default_mock_store.modules.trade.contract_type = TRADE_TYPES.MULTIPLIER;
        render(mockTradeParameters());

        expect(screen.getByText(TRADE_PARAMS.MULTIPLIER)).toBeInTheDocument();
        expect(screen.getByText(TRADE_PARAMS.STAKE)).toBeInTheDocument();
        expect(screen.getByText(TRADE_PARAMS.RISK_MANAGEMENT)).toBeInTheDocument();
        expect(screen.queryByText(TRADE_PARAMS.MULTIPLIERS_CANCELLATION_INFO)).not.toBeInTheDocument();
        expect(screen.getAllByTestId(data_test)).toHaveLength(3);
    });

    it('renders correct trade params for Multipliers if has_cancellation === true', () => {
        default_mock_store.modules.trade.contract_type = TRADE_TYPES.MULTIPLIER;
        default_mock_store.modules.trade.has_cancellation = true;
        render(mockTradeParameters());

        expect(screen.getByText(TRADE_PARAMS.MULTIPLIER)).toBeInTheDocument();
        expect(screen.getByText(TRADE_PARAMS.STAKE)).toBeInTheDocument();
        expect(screen.getByText(TRADE_PARAMS.RISK_MANAGEMENT)).toBeInTheDocument();
        expect(screen.getByText(TRADE_PARAMS.MULTIPLIERS_CANCELLATION_INFO)).toBeInTheDocument();
        expect(screen.getAllByTestId(data_test)).toHaveLength(4);
    });

    it('renders correct trade params for Rise/Fall', () => {
        default_mock_store.modules.trade.contract_type = TRADE_TYPES.RISE_FALL;
        render(mockTradeParameters());

        expect(screen.getByText(TRADE_PARAMS.DURATION)).toBeInTheDocument();
        expect(screen.getByText(TRADE_PARAMS.STAKE)).toBeInTheDocument();
        expect(screen.getByText(TRADE_PARAMS.ALLOW_EQUALS)).toBeInTheDocument();
        expect(screen.getAllByTestId(data_test)).toHaveLength(3);
    });

    it('renders correct trade params for Rise/Fall if is_minimized and is_market_closed  === true', () => {
        default_mock_store.modules.trade.contract_type = TRADE_TYPES.RISE_FALL;
        default_mock_store.modules.trade.is_market_closed = true;
        render(mockTradeParameters());

        expect(screen.getByText(TRADE_PARAMS.DURATION)).toBeInTheDocument();
        expect(screen.getByText(TRADE_PARAMS.STAKE)).toBeInTheDocument();
        expect(screen.getByText(TRADE_PARAMS.ALLOW_EQUALS)).toBeInTheDocument();
        expect(screen.getAllByTestId(data_test)).toHaveLength(3);
    });

    it('renders correct trade params for Higher/Lower', () => {
        default_mock_store.modules.trade.contract_type = TRADE_TYPES.HIGH_LOW;
        render(mockTradeParameters());

        expect(screen.getByText(TRADE_PARAMS.TRADE_TYPE_TABS)).toBeInTheDocument();
        expect(screen.getByText(TRADE_PARAMS.DURATION)).toBeInTheDocument();
        expect(screen.getByText(TRADE_PARAMS.BARRIER)).toBeInTheDocument();
        expect(screen.getByText(TRADE_PARAMS.STAKE)).toBeInTheDocument();
        expect(screen.getByText(TRADE_PARAMS.PAYOUT)).toBeInTheDocument();
        expect(screen.getAllByTestId(data_test)).toHaveLength(5);
    });

    it('renders correct trade params for Touch/No Touch', () => {
        default_mock_store.modules.trade.contract_type = TRADE_TYPES.TOUCH;
        render(mockTradeParameters());

        expect(screen.getByText(TRADE_PARAMS.TRADE_TYPE_TABS)).toBeInTheDocument();
        expect(screen.getByText(TRADE_PARAMS.DURATION)).toBeInTheDocument();
        expect(screen.getByText(TRADE_PARAMS.BARRIER)).toBeInTheDocument();
        expect(screen.getByText(TRADE_PARAMS.STAKE)).toBeInTheDocument();
        expect(screen.getByText(TRADE_PARAMS.PAYOUT)).toBeInTheDocument();
        expect(screen.getAllByTestId(data_test)).toHaveLength(5);
    });

    it('renders correct trade params for Matches/Differs', () => {
        default_mock_store.modules.trade.contract_type = TRADE_TYPES.MATCH_DIFF;
        render(mockTradeParameters());

        expect(screen.getByText(TRADE_PARAMS.LAST_DIGIT_PREDICTION)).toBeInTheDocument();
        expect(screen.getByText(TRADE_PARAMS.DURATION)).toBeInTheDocument();
        expect(screen.getByText(TRADE_PARAMS.STAKE)).toBeInTheDocument();
        expect(screen.getAllByTestId(data_test)).toHaveLength(3);
    });

    it('renders correct trade params for Even/Odd', () => {
        default_mock_store.modules.trade.contract_type = TRADE_TYPES.EVEN_ODD;
        render(mockTradeParameters());

        expect(screen.getByText(TRADE_PARAMS.DURATION)).toBeInTheDocument();
        expect(screen.getByText(TRADE_PARAMS.STAKE)).toBeInTheDocument();
        expect(screen.getAllByTestId(data_test)).toHaveLength(2);
    });

    it('renders correct trade params for Over/Under', () => {
        default_mock_store.modules.trade.contract_type = TRADE_TYPES.OVER_UNDER;
        render(mockTradeParameters());

        expect(screen.getByText(TRADE_PARAMS.LAST_DIGIT_PREDICTION)).toBeInTheDocument();
        expect(screen.getByText(TRADE_PARAMS.DURATION)).toBeInTheDocument();
        expect(screen.getByText(TRADE_PARAMS.STAKE)).toBeInTheDocument();
        expect(screen.getAllByTestId(data_test)).toHaveLength(3);
    });
});
