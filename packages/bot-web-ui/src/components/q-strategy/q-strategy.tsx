import React from 'react';
import { connect } from 'Stores/connect';
import RootStore from 'Stores/index';
import { TQuickStrategyProps } from './q-strategy.types';
import { QStrategyContainer } from './q-strategy-components';
import { localize } from '@deriv/translations';

const QStrategy = (props: TQuickStrategyProps) => {
    const { is_mobile, toggleStrategyModal } = props;
    /* eslint-disable no-console */
    console.log('QStrategy props', props);
    React.useEffect(() => {
        toggleStrategyModal();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <>
            {is_mobile ? (
                <div>
                    <p>{localize('Mobile version is coming soon to DBot')}</p>
                </div>
            ) : (
                <div className='q-strategy__container'>
                    <p>{localize('Quick strategy')}</p>
                    <p>{localize('Choose a template and set your trade parameters.')}</p>
                    <QStrategyContainer {...props} />
                </div>
            )}
        </>
    );
};

export default connect(({ run_panel, quick_strategy, ui }: RootStore) => ({
    active_index: quick_strategy.active_index,
    createStrategy: quick_strategy.createStrategy,
    duration_unit_dropdown: quick_strategy.duration_unit_dropdown,
    getSizeDesc: quick_strategy.getSizeDesc,
    getSizeText: quick_strategy.getSizeText,
    initial_errors: quick_strategy.initial_errors,
    initial_values: quick_strategy.initial_values,
    is_onscreen_keyboard_active: ui.is_onscreen_keyboard_active,
    is_mobile: ui.is_mobile,
    is_stop_button_visible: run_panel.is_stop_button_visible,
    onChangeDropdownItem: quick_strategy.onChangeDropdownItem,
    onChangeInputValue: quick_strategy.onChangeInputValue,
    onHideDropdownList: quick_strategy.onHideDropdownList,
    onScrollStopDropdownList: quick_strategy.onScrollStopDropdownList,
    setActiveTabIndex: quick_strategy.setActiveTabIndex,
    selected_symbol: quick_strategy.selected_symbol,
    selected_trade_type: quick_strategy.selected_trade_type,
    selected_duration_unit: quick_strategy.selected_duration_unit,
    symbol_dropdown: quick_strategy.symbol_dropdown,
    toggleStrategyModal: quick_strategy.toggleStrategyModal,
    trade_type_dropdown: quick_strategy.trade_type_dropdown,
    validateQuickStrategy: quick_strategy.validateQuickStrategy,
    setCurrentFocus: ui.setCurrentFocus,
}))(QStrategy);
