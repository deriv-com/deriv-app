import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TCoreStores } from '@deriv/stores/types';
import { mockStore } from '@deriv/stores';
import TraderProviders from '../../../../../trader-providers';
import ScreenSmall from '../screen-small';

const default_mock_props = {
    is_trade_enabled: true,
};
const default_mock_store = {
    modules: {
        trade: {
            is_accumulator: false,
            is_equal: false,
            is_multiplier: false,
            is_turbos: false,
            is_vanilla: false,
            duration_unit: 'm',
            contract_types_list: {},
            contract_type: 'test',
            expiry_type: 'endtime',
            contract_start_type: 'spot',
            form_components: ['test'],
            has_take_profit: false,
            onChange: jest.fn(),
            previous_symbol: 'test',
            is_trade_params_expanded: false,
            setIsTradeParamsExpanded: jest.fn(),
            take_profit: 'test',
            last_digit: 9,
        },
    },
};

jest.mock('@deriv/components', () => ({
    ...jest.requireActual('@deriv/components'),
    Collapsible: jest.fn(({ onClick, children }) => <div onClick={onClick}>{children}</div>),
}));
jest.mock('App/Components/Elements/ContentLoader', () => ({
    ...jest.requireActual('App/Components/Elements/ContentLoader'),
    TradeParamsLoader: jest.fn(() => <div>TradeParamsLoader</div>),
}));
jest.mock('Modules/Contract/Components/AccumulatorsStats', () => jest.fn(() => <div>AccumulatorsStats</div>));
jest.mock('Modules/Trading/Containers/contract-type', () => jest.fn(() => <div>ContractType</div>));
jest.mock('Modules/Trading/Components/Form/TradeParams/Multiplier/widgets.jsx', () => ({
    ...jest.requireActual('Modules/Trading/Components/Form/TradeParams/Multiplier/widgets.jsx'),
    AccumulatorOptionsWidget: jest.fn(() => <div>AccumulatorOptionsWidget</div>),
    MultiplierOptionsWidget: jest.fn(() => <div>MultiplierOptionsWidget</div>),
}));
jest.mock('Modules/Trading/Components/Form/TradeParams/trade-type-tabs', () => jest.fn(() => <div>TradeTypeTabs</div>));
jest.mock('Modules/Trading/Containers/trade-params-mobile', () => ({
    ...jest.requireActual('Modules/Trading/Containers/trade-params-mobile'),
    BarrierMobile: jest.fn(() => <div>BarrierMobile</div>),
    LastDigitMobile: jest.fn(() => <div>LastDigitMobile</div>),
}));
jest.mock('Modules/Trading/Components/Form/TradeParams/Turbos/barrier-selector', () =>
    jest.fn(() => <div>BarrierSelector</div>)
);
jest.mock('Modules/Trading/Components/Form/TradeParams/strike.jsx', () => jest.fn(() => <div>Strike</div>));
jest.mock('Modules/Trading/Components/Elements/mobile-widget.jsx', () =>
    jest.fn(props => <div onClick={props.toggleDigitsWidget}>MobileWidget</div>)
);
jest.mock('Modules/Trading/Containers/allow-equals', () => jest.fn(() => <div>AllowEqualsMobile</div>));
jest.mock('Modules/Trading/Components/Elements/Multiplier/risk-management-info', () =>
    jest.fn(() => <div>RiskManagementInfo</div>)
);
jest.mock('Modules/Trading/Components/Form/TradeParams/Accumulator/accumulators-amount-mobile', () =>
    jest.fn(() => <div>AccumulatorsAmountMobile</div>)
);
jest.mock('Modules/Trading/Components/Form/TradeParams/Multiplier/take-profit.jsx', () =>
    jest.fn(() => <div>TakeProfit</div>)
);
jest.mock('Modules/Trading/Components/Form/TradeParams/Accumulator/accumulators-info-display', () =>
    jest.fn(() => <div>AccumulatorsInfoDisplay</div>)
);
jest.mock('Modules/Trading/Components/Elements/payout-per-point-mobile', () =>
    jest.fn(() => <div>PayoutPerPointMobile</div>)
);
jest.mock('Modules/Trading/Containers/purchase', () => jest.fn(() => <div>Purchase</div>));

describe('<ScreenSmall />', () => {
    const mockScreenSmall = (mocked_store: TCoreStores, mocked_props: { is_trade_enabled: boolean }) => {
        return (
            <TraderProviders store={mocked_store}>
                <ScreenSmall {...mocked_props} />
            </TraderProviders>
        );
    };
    it('should render TradeParamsLoader if is_trade_enabled === false', () => {
        render(mockScreenSmall(mockStore(default_mock_store), { is_trade_enabled: false }));

        expect(screen.getByText(/TradeParamsLoader/i)).toBeInTheDocument();
    });
    it('should render CollapsibleTradeParams if is_trade_enabled === true', () => {
        render(mockScreenSmall(mockStore(default_mock_store), default_mock_props));

        expect(screen.getByText(/ContractType/i)).toBeInTheDocument();
        expect(screen.getByText(/MobileWidget/i)).toBeInTheDocument();
        expect(screen.getByText(/Purchase/i)).toBeInTheDocument();
        expect(screen.queryByText(/TradeParamsLoader/i)).not.toBeInTheDocument();
        expect(screen.queryByText(/TradeTypeTabs/i)).not.toBeInTheDocument();
        expect(screen.queryByText(/Digit: 9/i)).not.toBeInTheDocument();
        expect(screen.queryByText(/LastDigitMobile/i)).not.toBeInTheDocument();
        expect(screen.queryByText(/BarrierMobile/i)).not.toBeInTheDocument();
        expect(screen.queryByText(/BarrierSelector/i)).not.toBeInTheDocument();
        expect(screen.queryByText(/Strike/i)).not.toBeInTheDocument();
    });
    it('should call function setIsTradeParamsExpanded if MobileWidget was toggled', () => {
        render(mockScreenSmall(mockStore(default_mock_store), default_mock_props));

        userEvent.click(screen.getByText(/MobileWidget/i));

        expect(default_mock_store.modules.trade.setIsTradeParamsExpanded).toBeCalled();
    });
    it('should render all specific for Accumulators components inside CollapsibleTradeParams if is_accumulator === true', () => {
        default_mock_store.modules.trade.is_accumulator = true;
        render(mockScreenSmall(mockStore(default_mock_store), default_mock_props));

        expect(screen.getByText(/AccumulatorsStats/i)).toBeInTheDocument();
        expect(screen.getByText(/AccumulatorOptionsWidget/i)).toBeInTheDocument();
        expect(screen.getByText(/AccumulatorsAmountMobile/i)).toBeInTheDocument();
    });
    it('should render all specific for Multipliers components inside CollapsibleTradeParams if is_multiplier === true', () => {
        default_mock_store.modules.trade.is_accumulator = false;
        default_mock_store.modules.trade.is_multiplier = true;
        render(mockScreenSmall(mockStore(default_mock_store), default_mock_props));

        expect(screen.getByText(/MultiplierOptionsWidget/i)).toBeInTheDocument();
        expect(screen.getByText(/RiskManagementInfo/i)).toBeInTheDocument();
    });
    it('should render all specific for Turbos components inside CollapsibleTradeParams if is_turbos === true', () => {
        default_mock_store.modules.trade.is_multiplier = false;
        default_mock_store.modules.trade.is_turbos = true;
        render(mockScreenSmall(mockStore(default_mock_store), default_mock_props));

        expect(screen.getByText(/TakeProfit/i)).toBeInTheDocument();
        expect(screen.getByText(/PayoutPerPointMobile/i)).toBeInTheDocument();
    });
    it('should render all specific components inside CollapsibleTradeParams if isVisible returns true for current trade type', () => {
        default_mock_store.modules.trade.form_components = [
            'trade_type_tabs',
            'last_digit',
            'barrier',
            'barrier_selector',
            'strike',
        ];
        render(mockScreenSmall(mockStore(default_mock_store), default_mock_props));

        expect(screen.getByText(/TradeTypeTabs/i)).toBeInTheDocument();
        expect(screen.getByText(/Digit: 9/i)).toBeInTheDocument();
        expect(screen.getByText(/LastDigitMobile/i)).toBeInTheDocument();
        expect(screen.getByText(/BarrierMobile/i)).toBeInTheDocument();
        expect(screen.getByText(/BarrierSelector/i)).toBeInTheDocument();
        expect(screen.getByText(/Strike/i)).toBeInTheDocument();
    });
    it('should render specific for allow_equals component inside CollapsibleTradeParams', () => {
        default_mock_store.modules.trade.is_turbos = false;
        default_mock_store.modules.trade.is_equal = true;
        default_mock_store.modules.trade.contract_type = 'rise_fall_equal';
        default_mock_store.modules.trade.contract_types_list = {
            'Ups & Downs': {
                categories: [
                    { text: 'Rise/Fall', value: 'rise_fall' },
                    { text: 'Rise/Fall', value: 'rise_fall_equal' },
                ],
                name: 'Ups & Downs',
            },
        };
        render(mockScreenSmall(mockStore(default_mock_store), default_mock_props));

        expect(screen.getByText(/AllowEqualsMobile/i)).toBeInTheDocument();
    });
});
