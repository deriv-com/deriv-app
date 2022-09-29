import React from 'react';
import { TQuickStrategyProps, TSymbolItem } from '../quick-strategy.types';
import { QuickStrategyForm, MarketOption, TradeTypeOption } from '.';

const QuickStrategyContainer = (props: TQuickStrategyProps) => {
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
        setActiveTab,
    } = props;

    const symbol_dropdown_options = React.useMemo(
        () =>
            symbol_dropdown
                .map((symbol: TSymbolItem, idx) => ({
                    component: <MarketOption key={idx} symbol={symbol} />,
                    ...symbol,
                }))
                .filter(option => option.group !== 'Cryptocurrencies'), // Until Crypto enabled for Dbot
        [symbol_dropdown]
    );

    const trade_type_dropdown_options = React.useMemo(
        () =>
            trade_type_dropdown.map((trade_type, idx) => ({
                component: <TradeTypeOption key={idx} trade_type={trade_type} />,
                ...trade_type,
            })),
        [trade_type_dropdown]
    );

    return (
        <>
            <QuickStrategyForm
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
                setActiveTab={setActiveTab}
            />
        </>
    );
};

export default React.memo(QuickStrategyContainer);
