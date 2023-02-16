import React from 'react';
import { MobileFullPageModal, Text, Dialog } from '@deriv/components';
import { localize } from '@deriv/translations';
import { connect } from 'Stores/connect';
import { isMobile } from '@deriv/shared';

type TStopBotModal = {
    is_running: boolean;
    is_dialog_open: boolean;
    onOkButtonClick: () => void;
    toggleStopBotDialog: () => void;
};

const StopBotModalContent = ({ is_running, is_dialog_open, onOkButtonClick, toggleStopBotDialog }: TStopBotModal) => {
    const confirm_button_text = is_running ? localize('Stop my bot') : localize('Keep my contract');
    const cancel_button_text = is_running ? localize('Back') : localize('Close my contract');
    const title_text = is_running ? localize('Stop your current bot?') : localize('Keep your current contract?');
    return (
        <React.Fragment>
            <Dialog
                portal_element_id='modal_root'
                title={title_text}
                is_visible={is_dialog_open}
                confirm_button_text={confirm_button_text}
                onConfirm={onOkButtonClick}
                cancel_button_text={cancel_button_text}
                onCancel={toggleStopBotDialog} //!TODO replace it after set implementation,
                is_mobile_full_width={false}
                className={'toolbar__dialog'}
                has_close_icon
            >
                {is_running ? (
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
                ) : (
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
                )}
            </Dialog>
        </React.Fragment>
    );
};

const StopBotModal = ({ is_running, is_dialog_open, onOkButtonClick, toggleStopBotDialog }: TStopBotModal) =>
    isMobile() ? (
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
                is_dialog_open={is_dialog_open}
                onOkButtonClick={onOkButtonClick}
                toggleStopBotDialog={toggleStopBotDialog}
            />
        </MobileFullPageModal>
    ) : (
        <StopBotModalContent
            is_running={is_running}
            is_dialog_open={is_dialog_open}
            onOkButtonClick={onOkButtonClick}
            toggleStopBotDialog={toggleStopBotDialog}
        />
    );

export default connect(({ run_panel, toolbar, quick_strategy }: RootStore) => ({
    is_dialog_open: quick_strategy.is_dialog_open,
    is_running: run_panel.is_running,
    onOkButtonClick: toolbar.onResetOkButtonClick, //!TODO replace it after set implementation
    toggleStopBotDialog: quick_strategy.toggleStopBotDialog,
}))(StopBotModal);
