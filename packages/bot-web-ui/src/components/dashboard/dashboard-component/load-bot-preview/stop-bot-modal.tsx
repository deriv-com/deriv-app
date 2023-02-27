import React from 'react';
import { MobileFullPageModal, Text, Dialog } from '@deriv/components';
import { localize } from '@deriv/translations';
import { connect } from 'Stores/connect';
import { isMobile, isValidToSell, isMultiplierContract } from '@deriv/shared';
import { TContractInfo } from '../../../../../../shared/src/utils/contract/contract-types';
import { observer } from '@deriv/bot-skeleton';

type TStopBotModal = {
    is_running: boolean;
    is_dialog_open: boolean;
    onOkButtonClick: () => void;
    toggleStopBotDialog: () => void;
    stopBot: () => void;
    contract_resale_info: TContractInfo;
    is_multiplier: boolean;
    contract_type: string;
};

const StopBotModalContent = ({
    contract_resale_info,
    is_running,
    is_dialog_open,
    onOkButtonClick,
    toggleStopBotDialog,
    stopBot,
}: TStopBotModal) => {
    let is_multiplier;
    const checkMultiplier = contract_type => {
        if (contract_type === 'MULTUP') {
            return true;
        }
        return false;
    };
    // is_multiplier = checkMultiplier(contract_resale_info?.contract.contract_type)
    const onContractStatusEvent = data => {
        if (data.id === 'contract.sold') {
            is_multiplier = checkMultiplier(data.contract.contract_type);
            // console.log(data.contract.contract_type, "data")
            // console.log(is_multiplier, 'is_multiplier');
        }
    };

    observer.register('contract.status', onContractStatusEvent);

    // console.log(is_running && !!is_multiplier, 'conditions')

    const isResaleOffered = false;
    const confirm_button_text = is_running && !!is_multiplier ? localize('Stop my bot') : localize('Keep my contract');
    const cancel_button_text = is_running && !!is_multiplier ? localize('Back') : localize('Close my contract');
    const title_text =
        is_running && !!is_multiplier ? localize('Stop your current bot?') : localize('Keep your current contract?');
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

export default connect(({ run_panel, toolbar, quick_strategy, summary_card }: RootStore) => ({
    is_dialog_open: quick_strategy.is_dialog_open,
    is_running: run_panel.is_running,
    onOkButtonClick: toolbar.onResetOkButtonClick, //!TODO replace it after set implementation
    toggleStopBotDialog: quick_strategy.toggleStopBotDialog,
    stopBot: quick_strategy.stopBot,
    contract_resale_info: run_panel.contract_resale_info,
    is_multiplier: summary_card.is_multiplier,
}))(StopBotModal);
