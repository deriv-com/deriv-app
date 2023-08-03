import React from 'react';
import { MobileFullPageModal, Modal } from '@deriv/components';
import { isMobile } from '@deriv/shared';
import { observer, useStore } from '@deriv/stores';
import { localize } from '@deriv/translations';
import { useDBotStore } from 'Stores/useDBotStore';
import { QuickStrategyContainer } from './quick-strategy-components';

const QuickStrategy = observer(() => {
    const is_mobile = isMobile();
    const { quick_strategy, run_panel } = useDBotStore();
    const { ui } = useStore();
    const {
        is_strategy_modal_open,
        loadDataStrategy,
        active_index,
        description,
        createStrategy,
        duration_unit_dropdown,
        types_strategies_dropdown,
        getSizeDesc,
        initial_values,
        onChangeDropdownItem,
        onChangeInputValue,
        onHideDropdownList,
        onScrollStopDropdownList,
        selected_symbol,
        selected_trade_type,
        selected_duration_unit,
        selected_type_strategy,
        symbol_dropdown,
        trade_type_dropdown,
        toggleStopBotDialog,
        is_contract_dialog_open,
        is_stop_bot_dialog_open,
    } = quick_strategy;
    const { is_stop_button_visible, is_running } = run_panel;
    const { is_onscreen_keyboard_active, setCurrentFocus } = ui;

    const quick_strategy_props = {
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
    };

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
                    <QuickStrategyContainer {...quick_strategy_props} />
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
                        <QuickStrategyContainer {...quick_strategy_props} />
                    </div>
                </Modal>
            )}
        </>
    );
});

export default QuickStrategy;
