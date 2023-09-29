import React from 'react';
import { render, screen } from '@testing-library/react';
import TraderProviders from '../../../../../trader-providers';
import { mockStore } from '@deriv/stores';
import { TCoreStores } from '@deriv/stores/types';
import ScreenSmall from '../screen-small';

const default_mock_props = {
    is_trade_enabled: true,
};
const default_mock_store = {
    modules: {
        trade: {
            // contract_type: 'accumulator',
            // symbol: 'test_symbol',
            is_accumulator: false,
            is_multiplier: false,
            is_turbos: false,
            is_vanilla: false,
            duration_unit: 'm',
            // contract_types_list:{
            //   Multipliers: {name: 'test',
            //   categories: [{text:'test', value:'tests'}]},
            // 'Ups & Downs': TContractTypesList;
            // 'Highs & Lows': TContractTypesList;
            // 'Ins & Outs': TContractTypesList;
            // 'Look Backs': TContractTypesList;
            // Digits: TContractTypesList;
            // Vanillas: TContractTypesList;
            // Accumulators: TContractTypesList;,
            contract_types_list: {},
            contract_type: 'test',
            expiry_type: 'tests',
            contract_start_type: 'test',
            form_components: ['test'],
            has_take_profit: false,
            onChange: jest.fn(),
            previous_symbol: 'test',
            is_trade_params_expanded: true,
            setIsTradeParamsExpanded: jest.fn(),
            take_profit: 'test',
        },
    },
};

jest.mock('App/Components/Elements/ContentLoader', () => ({
    ...jest.requireActual('App/Components/Elements/ContentLoader'),
    TradeParamsLoader: jest.fn(() => <div>TradeParamsLoader</div>),
}));
jest.mock('../Modules/Contract/Components/AccumulatorsStats', () => jest.fn(() => <div>AccumulatorsStats</div>));
jest.mock('Modules/Trading/Containers/contract-type', () => jest.fn(() => <div>ContractType</div>));
jest.mock('Modules/Trading/Components/Form/TradeParams/Multiplier/widgets.jsx', () => ({
    ...jest.requireActual('Modules/Trading/Components/Form/TradeParams/Multiplier/widgets.jsx'),
    AccumulatorOptionsWidget: jest.fn(() => <div>AccumulatorOptionsWidget</div>),
    MultiplierOptionsWidget: jest.fn(() => <div>MultiplierOptionsWidget</div>),
}));
jest.mock('Modules/Trading/Components/Form/TradeParams/trade-type-tabs', () => jest.fn(() => <div>TradeTypeTabs</div>));
jest.mock('Modules/Trading/Containers/trade-params-mobile.jsx', () => ({
    ...jest.requireActual('Modules/Trading/Containers/trade-params-mobile.jsx'),
    BarrierMobile: jest.fn(() => <div>BarrierMobile</div>),
    LastDigitMobile: jest.fn(() => <div>LastDigitMobile</div>),
}));
// jest.mock('@deriv/shared', () => ({
//     ...jest.requireActual('@deriv/shared'),
//     isMobile: jest.fn(() => false),
// }));
// jest.mock('../screen-large', () => jest.fn(() => 'ScreenLarge'));

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
    });
});
