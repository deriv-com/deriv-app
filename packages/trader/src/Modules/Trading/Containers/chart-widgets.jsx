import React from 'react';
import { isMobile } from '@deriv/shared';
import Digits from 'Modules/Contract/Components/Digits';
import AccumulatorsStats from 'Modules/Contract/Components/AccumulatorsStats';
import { connect } from 'Stores/connect';
import BottomWidgets from '../../SmartChart/Components/bottom-widgets.jsx';
import ControlWidgets from '../../SmartChart/Components/control-widgets.jsx';
import TopWidgets from '../../SmartChart/Components/top-widgets.jsx';
import { symbolChange } from '../../SmartChart/Helpers/symbol';

export const DigitsWidget = connect(({ modules, contract_trade }) => ({
    contract_info: contract_trade.last_contract.contract_info || {},
    digits_info: contract_trade.last_contract.digits_info || {},
    display_status: contract_trade.last_contract.display_status,
    is_digit_contract: contract_trade.last_contract.is_digit_contract,
    is_ended: contract_trade.last_contract.is_ended,
    selected_digit: modules.trade.last_digit,
    onDigitChange: modules.trade.onChange,
    underlying: modules.trade.symbol,
    trade_type: modules.trade.contract_type,
}))(
    ({
        contract_info,
        digits,
        digits_info,
        display_status,
        is_digit_contract,
        is_ended,
        onDigitChange,
        selected_digit,
        tick,
        trade_type,
        underlying,
    }) => (
        <Digits
            contract_info={contract_info}
            digits_array={digits}
            digits_info={digits_info}
            display_status={display_status}
            is_digit_contract={is_digit_contract}
            is_ended={is_ended}
            onDigitChange={onDigitChange}
            is_trade_page
            tick={tick}
            trade_type={trade_type}
            selected_digit={selected_digit}
            underlying={underlying}
        />
    )
);

// Chart widgets passed into SmartCharts
export const ChartTopWidgets = connect(({ modules, ui }) => ({
    onSymbolChange: modules.trade.onChange,
    theme: ui.is_dark_mode_on ? 'dark' : 'light',
}))(({ onSymbolChange, charts_ref, theme, is_digits_widget_active, open_market, open }) => {
    let yAxiswidth;
    if (charts_ref && charts_ref.chart) {
        yAxiswidth = charts_ref.chart.yAxiswidth;
    }
    return (
        <TopWidgets
            open_market={open_market}
            open={open}
            is_mobile={isMobile()}
            is_digits_widget_active={is_digits_widget_active}
            onSymbolChange={symbolChange(onSymbolChange)}
            theme={theme}
            y_axis_width={yAxiswidth}
        />
    );
});

export const ChartBottomWidgets = ({ digits, tick, show_accumulators_stats }) => (
    <BottomWidgets
        Widget={show_accumulators_stats ? <AccumulatorsStats /> : <DigitsWidget digits={digits} tick={tick} />}
    />
);

export const ChartControlWidgets = connect(({ contract_trade }) => ({
    updateChartType: contract_trade.updateChartType,
    updateGranularity: contract_trade.updateGranularity,
}))(({ updateChartType, updateGranularity }) => (
    <ControlWidgets updateChartType={updateChartType} updateGranularity={updateGranularity} />
));
