import React from 'react';
import { TQuickStrategyProps, TSymbolItem } from '../q-strategy.types';
import { QStrategyForm, MarketOption, TradeTypeOption, QStrategyFields } from '.';

const QStrategyContainer = (props: TQuickStrategyProps) => {
    const {
        symbol_dropdown,
        trade_type_dropdown,
        active_index,
        description,
        createStrategy,
        duration_unit_dropdown,
        types_strategies_dropdown,
        getSizeDesc,
        initial_values,
        is_onscreen_keyboard_active,
        is_mobile,
        is_stop_button_visible,
        onChangeDropdownItem,
        onChangeInputValue,
        onHideDropdownList,
        onScrollStopDropdownList,
        selected_symbol,
        selected_trade_type,
        setCurrentFocus,
        selected_duration_unit,
        selected_type_strategy,
        getFieldMap,
    } = props;

    const symbol_dropdown_options = symbol_dropdown
        .map((symbol: TSymbolItem) => ({ component: <MarketOption symbol={symbol} />, ...symbol }))
        .filter(option => option.group !== 'Cryptocurrencies'); // Until Crypto enabled for Dbot

    const trade_type_dropdown_options = trade_type_dropdown.map(trade_type => ({
        component: <TradeTypeOption trade_type={trade_type} />,
        ...trade_type,
    }));

    return (
        <>
            <QStrategyForm
                active_index={active_index}
                description={description}
                createStrategy={createStrategy}
                duration_unit_dropdown={duration_unit_dropdown}
                types_strategies_dropdown={types_strategies_dropdown}
                getSizeDesc={getSizeDesc}
                initial_values={initial_values}
                is_onscreen_keyboard_active={is_onscreen_keyboard_active}
                is_stop_button_visible={is_stop_button_visible}
                onChangeDropdownItem={onChangeDropdownItem}
                onChangeInputValue={onChangeInputValue}
                onHideDropdownList={onHideDropdownList}
                onScrollStopDropdownList={onScrollStopDropdownList}
                symbol_dropdown={symbol_dropdown_options}
                trade_type_dropdown={trade_type_dropdown_options}
                is_mobile={is_mobile}
                selected_symbol={selected_symbol}
                selected_trade_type={selected_trade_type}
                selected_duration_unit={selected_duration_unit}
                selected_type_strategy={selected_type_strategy}
                setCurrentFocus={setCurrentFocus}
                getFieldMap={getFieldMap}
            />
        </>
    );
};

export default QStrategyContainer;
