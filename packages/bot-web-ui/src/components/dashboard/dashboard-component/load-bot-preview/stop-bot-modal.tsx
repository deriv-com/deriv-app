import React from 'react';
import { MobileFullPageModal, Text, Dialog } from '@deriv/components';
import { localize } from '@deriv/translations';
import { connect } from 'Stores/connect';
import { isMobile } from '@deriv/shared';

type TStopBotModal = {
    is_running: boolean;
    is_dialog_open: boolean;
    is_contract_dialog_open: boolean;
    is_stop_bot_dialog_open: boolean;
    is_multiplier: boolean;
    closeMultiplierContract: () => void;
    onOkButtonClick: () => void;
    toggleStopBotDialog: () => void;
    stopMyBot: () => void;
    loadDataStrategy: () => void;
};

const StopBotModalContent = ({
    is_running,
    is_multiplier,
    is_contract_dialog_open,
    is_stop_bot_dialog_open,
    closeMultiplierContract,
    onOkButtonClick,
}: TStopBotModal) => {
    console.log('StopBotModalContent', 'is_stop_bot_dialog_open', is_stop_bot_dialog_open, 'is_contract_dialog_open', is_contract_dialog_open);
    
    const confirm_button_text = is_running && is_multiplier ? localize('Keep my contract') : localize('Stop my bot');
    const cancel_button_text = is_running && is_multiplier ? localize('Close my contract') : localize('Back');
    const title_text =
        is_running && is_multiplier ? localize('Keep your current contract?') : localize('Stop your current bot?');
    return (
        <React.Fragment>
            <Dialog
                portal_element_id='modal_root'
                title={title_text}
                is_visible={is_running ? is_stop_bot_dialog_open : is_contract_dialog_open}
                confirm_button_text={confirm_button_text}
                onConfirm={onOkButtonClick}
                cancel_button_text={cancel_button_text}
                onCancel={closeMultiplierContract}
                is_mobile_full_width={false}
                className={'toolbar__dialog'}
                has_close_icon
            >
                {is_running && is_multiplier ? (
                    <>
                        <Text as='p' line_height='s' size='xs' styles={{ paddingBottom: '2rem', paddingTop: '1rem' }}>
                            {localize(
                                'Close your contract now or keep it running. If you decide to keep it running, you can check and close it later on the '
                            )}
                            <Text
                                as='span'
                                line_height='s'
                                size='xs'
                                styles={{ color: 'var(--button-primary-default)' }}
                            >
                                <strong>{localize('Reports')}</strong>
                            </Text>
                            {localize(' page.')}
                        </Text>
                        <Text as='p' line_height='s' size='xs'>
                            {localize('The Quick Strategy you just created will be loaded to the workspace.')}
                        </Text>
                    </>
                ) : (
                    <>
                        <Text as='p' line_height='s' size='xs' styles={{ paddingBottom: '2rem', paddingTop: '1rem' }}>
                            {localize(
                                'Stopping the current bot will load the Quick Strategy you just created to the workspace.'
                            )}
                        </Text>
                        <Text as='p' line_height='s' size='xs'>
                            {localize(' Any open contracts can be viewed on the ')}
                            <Text
                                as='span'
                                line_height='s'
                                size='xs'
                                styles={{ color: 'var(--button-primary-default)' }}
                            >
                                <strong>{localize('Reports')}</strong>
                            </Text>
                            {localize(' page.')}
                        </Text>
                    </>
                )}
            </Dialog>
        </React.Fragment>
    );
};

const StopBotModal = ({
    is_running,
    is_dialog_open,
    is_contract_dialog_open,
    is_stop_bot_dialog_open,
    is_multiplier,
    closeMultiplierContract,
    stopMyBot,
    toggleStopBotDialog,
    loadDataStrategy,
}: TStopBotModal) =>
    {
        console.log('StopBotModal');
        
        return isMobile() ? (
            <MobileFullPageModal
                is_modal_open={is_dialog_open}
                className='save-modal__wrapper'
                header={localize('Save strategy')}
                onClickClose={toggleStopBotDialog}
                height_offset='80px'
                page_overlay
            >
                <StopBotModalContent
                    is_running={is_running}
                    onOkButtonClick={stopMyBot}
                    toggleStopBotDialog={toggleStopBotDialog}
                    is_contract_dialog_open={is_contract_dialog_open}
                    is_stop_bot_dialog_open={is_stop_bot_dialog_open}
                    is_multiplier={is_multiplier}
                    closeMultiplierContract={closeMultiplierContract} />
            </MobileFullPageModal>
        ) : (
            <StopBotModalContent
                is_running={is_running}
                onOkButtonClick={stopMyBot}
                is_contract_dialog_open={is_contract_dialog_open}
                is_stop_bot_dialog_open={is_stop_bot_dialog_open}
                is_multiplier={is_multiplier}
                closeMultiplierContract={closeMultiplierContract}
                is_dialog_open={is_dialog_open}
                toggleStopBotDialog={() => {
                    toggleStopBotDialog();
                } } />
        );
    };

export default connect(({ run_panel, toolbar, quick_strategy, summary_card }: RootStore) => ({
    is_dialog_open: quick_strategy.is_dialog_open,
    is_running: run_panel.is_running,
    is_multiplier: summary_card.is_multiplier,
    is_contract_dialog_open: quick_strategy.is_contract_dialog_open,
    is_stop_bot_dialog_open: quick_strategy.is_stop_bot_dialog_open,
    closeMultiplierContract: run_panel.closeMultiplierContract,
    onOkButtonClick: run_panel.onOkButtonClick,
    stopMyBot: run_panel.stopMyBot,
    toggleStopBotDialog: quick_strategy.toggleStopBotDialog,
    loadDataStrategy: quick_strategy.loadDataStrategy,
}))(StopBotModal);
