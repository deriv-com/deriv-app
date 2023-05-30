import { MobileFullPageModal, Modal } from '@deriv/components';
import { isMobile } from '@deriv/shared';
import { localize } from '@deriv/translations';
import React from 'react';
import { connect } from 'Stores/connect';
import RootStore from 'Stores/index';
import { QuickStrategyContainer } from './quick-strategy-components';
import { TQuickStrategyProps } from './quick-strategy.types';

const QuickStrategy = (props: TQuickStrategyProps) => {
    const is_mobile = isMobile();
    const { is_strategy_modal_open, loadDataStrategy } = props;

    return (
        <>
            {is_mobile ? (
                <MobileFullPageModal
                    is_modal_open={is_strategy_modal_open}
                    className='quick-strategy__wrapper'
                    header={localize('Quick Strategy')}
                    onClickClose={loadDataStrategy}
                    height_offset='8rem'
                >
                    <QuickStrategyContainer {...props} />
                </MobileFullPageModal>
            ) : (
                <Modal
                    title={localize('Quick strategy')}
                    className='modal--strategy'
                    is_open={is_strategy_modal_open}
                    toggleModal={loadDataStrategy}
                    width={'78rem'}
                >
                    <div className='modal__content'>
                        <QuickStrategyContainer {...props} />
                    </div>
                </Modal>
            )}
        </>
    );
};

export default connect(({ run_panel, quick_strategy, ui }: RootStore) => ({
    active_index: quick_strategy.active_index,
    description: quick_strategy.description,
    createStrategy: quick_strategy.createStrategy,
    duration_unit_dropdown: quick_strategy.duration_unit_dropdown,
    types_strategies_dropdown: quick_strategy.types_strategies_dropdown,
    getSizeDesc: quick_strategy.getSizeDesc,
    initial_values: quick_strategy.initial_values,
    is_onscreen_keyboard_active: ui.is_onscreen_keyboard_active,
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
    is_strategy_modal_open: quick_strategy.is_strategy_modal_open,
    setCurrentFocus: ui.setCurrentFocus,
    toggleStopBotDialog: quick_strategy.toggleStopBotDialog,
    is_running: run_panel.is_running,
    is_contract_dialog_open: quick_strategy.is_contract_dialog_open,
    is_stop_bot_dialog_open: quick_strategy.is_stop_bot_dialog_open,
}))(QuickStrategy);
