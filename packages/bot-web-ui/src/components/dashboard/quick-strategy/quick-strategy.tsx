import React from 'react';
import { connect } from 'Stores/connect';
import RootStore from 'Stores/index';
import { TQuickStrategyProps } from './quick-strategy.types';
import { QuickStrategyContainer } from './quick-strategy-components';

const QuickStrategy = (props: TQuickStrategyProps) => {
    const { loadDataStrategy } = props;
    React.useEffect(() => {
        loadDataStrategy();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div className='quick-strategy__container'>
            <QuickStrategyContainer {...props} />
        </div>
    );
};

export default connect(({ run_panel, quick_strategy, ui, dashboard }: RootStore) => ({
    active_index: quick_strategy.active_index,
    description: quick_strategy.description,
    createStrategy: quick_strategy.createStrategy,
    duration_unit_dropdown: quick_strategy.duration_unit_dropdown,
    types_strategies_dropdown: quick_strategy.types_strategies_dropdown,
    getSizeDesc: quick_strategy.getSizeDesc,
    initial_values: quick_strategy.initial_values,
    is_onscreen_keyboard_active: ui.is_onscreen_keyboard_active,
    is_mobile: ui.is_mobile,
    is_stop_button_visible: run_panel.is_stop_button_visible,
    onChangeDropdownItem: quick_strategy.onChangeDropdownItem,
    onChangeInputValue: quick_strategy.onChangeInputValue,
    onHideDropdownList: quick_strategy.onHideDropdownList,
    onScrollStopDropdownList: quick_strategy.onScrollStopDropdownList,
    selected_symbol: quick_strategy.selected_symbol,
    selected_trade_type: quick_strategy.selected_trade_type,
    selected_duration_unit: quick_strategy.selected_duration_unit,
    selected_type_strategy: quick_strategy.selected_type_strategy,
    symbol_dropdown: quick_strategy.symbol_dropdown,
    loadDataStrategy: quick_strategy.loadDataStrategy,
    trade_type_dropdown: quick_strategy.trade_type_dropdown,
    setCurrentFocus: ui.setCurrentFocus,
    setActiveTab: dashboard.setActiveTab,
}))(QuickStrategy);
