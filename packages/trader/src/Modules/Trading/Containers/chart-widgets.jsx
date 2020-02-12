import React from 'react';
import { isMobile } from '@deriv/shared/utils/screen';
import Digits from 'Modules/Contract/Components/Digits';
import { connect } from 'Stores/connect';
import BottomWidgets from '../../SmartChart/Components/bottom-widgets.jsx';
import ControlWidgets from '../../SmartChart/Components/control-widgets.jsx';
import TopWidgets from '../../SmartChart/Components/top-widgets.jsx';
import { symbolChange } from '../../SmartChart/Helpers/symbol';

export const DigitsWidget = connect(({ modules }) => ({
    contract_info: modules.contract_trade.last_contract.contract_info || {},
    digits_info: modules.contract_trade.last_contract.digits_info || {},
    display_status: modules.contract_trade.last_contract.display_status,
    is_digit_contract: modules.contract_trade.last_contract.is_digit_contract,
    is_ended: modules.contract_trade.last_contract.is_ended,
    underlying: modules.trade.symbol,
}))(({ contract_info, digits, digits_info, display_status, is_digit_contract, is_ended, tick, underlying }) => (
    <Digits
        contract_info={contract_info}
        digits_array={digits}
        digits_info={digits_info}
        display_status={display_status}
        is_digit_contract={is_digit_contract}
        is_ended={is_ended}
        is_trade_page
        tick={tick}
        underlying={underlying}
    />
));

// Chart widgets passed into SmartCharts
export const ChartTopWidgets = connect(({ modules }) => ({
    onSymbolChange: modules.trade.onChange,
}))(({ onSymbolChange }) => <TopWidgets is_mobile={isMobile()} onSymbolChange={symbolChange(onSymbolChange)} />);

export const ChartBottomWidgets = ({ digits, tick }) => (
    <BottomWidgets Digits={<DigitsWidget digits={digits} tick={tick} />} />
);

export const ChartControlWidgets = connect(({ modules }) => ({
    updateChartType: modules.contract_trade.updateChartType,
    updateGranularity: modules.contract_trade.updateGranularity,
}))(({ updateChartType, updateGranularity }) => (
    <ControlWidgets updateChartType={updateChartType} updateGranularity={updateGranularity} />
));
