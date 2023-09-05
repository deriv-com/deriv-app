import React from 'react';
import { TQuickStrategyProps, TSymbolItem } from '../quick-strategy.types';
import { MarketOption, QuickStrategyForm, TradeTypeOption } from '.';

const QuickStrategyContainer = (props: TQuickStrategyProps) => {
    const {
        symbol_dropdown,
        trade_type_dropdown,
        active_index,
        description,
        duration_unit_dropdown,
        types_strategies_dropdown,
        initial_values,
        is_onscreen_keyboard_active,
        is_stop_button_visible,
        selected_symbol,
        selected_trade_type,
        selected_duration_unit,
        selected_type_strategy,
        is_running,
        is_contract_dialog_open,
        is_stop_bot_dialog_open,
        createStrategy,
        getSizeDesc,
        onChangeDropdownItem,
        onChangeInputValue,
        onHideDropdownList,
        onScrollStopDropdownList,
        setCurrentFocus,
        toggleStopBotDialog,
    } = props;

    const symbol_dropdown_options = React.useMemo(
        () =>
            symbol_dropdown
                .map((symbol: TSymbolItem) => ({
                    component: <MarketOption key={symbol.text} symbol={symbol} />,
                    ...symbol,
                }))
                // Until Crypto enabled for Dbot
                .filter(option => option.group !== 'Cryptocurrencies')
                .filter(
                    option => option.text !== 'Volatility 150 (1s) Index' && option.text !== 'Volatility 250 (1s) Index'
                ),
        [symbol_dropdown]
    );

    const trade_type_dropdown_options = React.useMemo(
        () =>
            trade_type_dropdown.map(trade_type => ({
                component: <TradeTypeOption key={trade_type.text} trade_type={trade_type} />,
                ...trade_type,
            })),
        [trade_type_dropdown]
    );

    return (
        <QuickStrategyForm
            active_index={active_index}
            description={description}
            duration_unit_dropdown={duration_unit_dropdown}
            types_strategies_dropdown={types_strategies_dropdown}
            initial_values={initial_values}
            is_onscreen_keyboard_active={is_onscreen_keyboard_active}
            is_stop_button_visible={is_stop_button_visible}
            symbol_dropdown={symbol_dropdown_options}
            trade_type_dropdown={trade_type_dropdown_options}
            selected_symbol={selected_symbol}
            selected_trade_type={selected_trade_type}
            selected_duration_unit={selected_duration_unit}
            selected_type_strategy={selected_type_strategy}
            getSizeDesc={getSizeDesc}
            createStrategy={createStrategy}
            onChangeDropdownItem={onChangeDropdownItem}
            onChangeInputValue={onChangeInputValue}
            onHideDropdownList={onHideDropdownList}
            onScrollStopDropdownList={onScrollStopDropdownList}
            setCurrentFocus={setCurrentFocus}
            toggleStopBotDialog={toggleStopBotDialog}
            is_running={is_running}
            is_contract_dialog_open={is_contract_dialog_open}
            is_stop_bot_dialog_open={is_stop_bot_dialog_open}
        />
    );
};

export default React.memo(QuickStrategyContainer);
