import React from 'react';
import { render, screen } from '@testing-library/react';
import { mockStore } from '@deriv/stores';
import { TCoreStores } from '@deriv/stores/types';
import TradeParams from '../trade-params';
import TraderProviders from '../../../../trader-providers';

const default_mock_store = {
    modules: {
        trade: {
            form_components: ['duration'],
        },
    },
};

jest.mock('Modules/Trading/Components/Form/TradeParams/Duration', () => jest.fn(() => <div>Duration</div>));
jest.mock('Modules/Trading/Components/Form/TradeParams/barrier', () => jest.fn(() => <div>Barrier</div>));
jest.mock('Modules/Trading/Components/Form/TradeParams/last-digit', () => jest.fn(() => <div>LastDigit</div>));
jest.mock('Modules/Trading/Components/Form/TradeParams/Accumulator/accumulator', () =>
    jest.fn(() => <div>Accumulator</div>)
);
jest.mock('Modules/Trading/Components/Form/TradeParams/trade-type-tabs', () => jest.fn(() => <div>TradeTypeTabs</div>));
jest.mock('Modules/Trading/Components/Form/TradeParams/strike', () => jest.fn(() => <div>Strike</div>));
jest.mock('Modules/Trading/Components/Form/TradeParams/Turbos/payout-selector', () =>
    jest.fn(() => <div>PayoutSelector</div>)
);
jest.mock('Modules/Trading/Components/Form/TradeParams/amount', () => jest.fn(() => <div>Amount</div>));
jest.mock('Modules/Trading/Components/Form/TradeParams/Multiplier/take-profit', () =>
    jest.fn(() => <div>TakeProfit</div>)
);
jest.mock('Modules/Trading/Components/Form/TradeParams/Multiplier/stop-loss', () => jest.fn(() => <div>StopLoss</div>));
jest.mock('Modules/Trading/Components/Form/TradeParams/Multiplier/cancel-deal', () =>
    jest.fn(() => <div>CancelDeal</div>)
);
jest.mock('Modules/Trading/Components/Form/TradeParams/Multiplier/expiration', () =>
    jest.fn(() => <div>Expiration</div>)
);
jest.mock('Modules/Trading/Components/Form/TradeParams/Accumulator/accumulators-info-display', () =>
    jest.fn(() => <div>AccumulatorsInfoDisplay</div>)
);

describe('<TradeParams />', () => {
    const mockTradeParams = (mocked_store: TCoreStores) => {
        return (
            <TraderProviders store={mocked_store}>
                <TradeParams />
            </TraderProviders>
        );
    };

    it('should render Duration component inside of TradeParams if it is in the form_components array and do not render the rest components', () => {
        render(mockTradeParams(mockStore(default_mock_store)));

        expect(screen.getByText('Duration')).toBeInTheDocument();
        expect(screen.queryByText('Barrier')).not.toBeInTheDocument();
        expect(screen.queryByText('LastDigit')).not.toBeInTheDocument();
        expect(screen.queryByText('Accumulator')).not.toBeInTheDocument();
        expect(screen.queryByText('TradeTypeTabs')).not.toBeInTheDocument();
        expect(screen.queryByText('Strike')).not.toBeInTheDocument();
        expect(screen.queryByText('PayoutSelector')).not.toBeInTheDocument();
        expect(screen.queryByText('Amount')).not.toBeInTheDocument();
        expect(screen.queryByText('TakeProfit')).not.toBeInTheDocument();
        expect(screen.queryByText('StopLoss')).not.toBeInTheDocument();
        expect(screen.queryByText('CancelDeal')).not.toBeInTheDocument();
        expect(screen.queryByText('Expiration')).not.toBeInTheDocument();
        expect(screen.queryByText('AccumulatorsInfoDisplay')).not.toBeInTheDocument();
    });

    it('should render all components inside of TradeParams if they are in the form_components array', () => {
        const new_mock_store = { ...default_mock_store };
        new_mock_store.modules.trade.form_components = [
            'barrier',
            'last_digit',
            'accumulator',
            'trade_type_tabs',
            'strike',
            'payout_selector',
            'amount',
            'take_profit',
            'stop_loss',
            'cancellation',
            'expiration',
            'accu_info_display',
        ];
        render(mockTradeParams(mockStore(new_mock_store)));

        expect(screen.queryByText('Duration')).not.toBeInTheDocument();
        expect(screen.getByText('Barrier')).toBeInTheDocument();
        expect(screen.getByText('LastDigit')).toBeInTheDocument();
        expect(screen.getByText('Accumulator')).toBeInTheDocument();
        expect(screen.getByText('TradeTypeTabs')).toBeInTheDocument();
        expect(screen.getByText('Strike')).toBeInTheDocument();
        expect(screen.getByText('PayoutSelector')).toBeInTheDocument();
        expect(screen.getByText('Amount')).toBeInTheDocument();
        expect(screen.getByText('TakeProfit')).toBeInTheDocument();
        expect(screen.getByText('StopLoss')).toBeInTheDocument();
        expect(screen.getByText('CancelDeal')).toBeInTheDocument();
        expect(screen.getByText('Expiration')).toBeInTheDocument();
        expect(screen.getByText('AccumulatorsInfoDisplay')).toBeInTheDocument();
    });
});
