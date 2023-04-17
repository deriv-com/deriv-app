import React from 'react';
import { connect } from 'Stores/connect';
import RootStore from 'Stores/root-store';
import StopBotModalContent, { TStopBotModalContent } from '../stop-bot-modal-content';

type TStopBotModal = TStopBotModalContent & {
    stopMyBot: () => void;
};

const StopBotModal = ({
    is_running,
    is_contract_dialog_open,
    is_stop_bot_dialog_open,
    is_multiplier,
    is_dialog_open,
    closeMultiplierContract,
    stopMyBot,
    toggleStopBotDialog,
}: TStopBotModal) => (
    <StopBotModalContent
        is_running={is_running}
        onOkButtonClick={stopMyBot}
        is_contract_dialog_open={is_contract_dialog_open}
        is_stop_bot_dialog_open={is_stop_bot_dialog_open}
        is_multiplier={is_multiplier}
        closeMultiplierContract={closeMultiplierContract}
        is_dialog_open={is_dialog_open}
        toggleStopBotDialog={toggleStopBotDialog}
    />
);

export default connect(({ run_panel, quick_strategy, summary_card }: RootStore) => ({
    is_dialog_open: quick_strategy.is_dialog_open,
    is_running: run_panel.is_running,
    is_multiplier: summary_card.is_multiplier,
    is_contract_dialog_open: quick_strategy.is_contract_dialog_open,
    is_stop_bot_dialog_open: quick_strategy.is_stop_bot_dialog_open,
    closeMultiplierContract: run_panel.closeMultiplierContract,
    onOkButtonClick: run_panel.onOkButtonClick,
    stopMyBot: run_panel.stopMyBot,
    toggleStopBotDialog: quick_strategy.toggleStopBotDialog,
    is_strategy_modal_open: quick_strategy.is_strategy_modal_open,
}))(StopBotModal);
