import React from 'react';
import { Dialog, Text } from '@deriv/components';
import { useDepositLocked } from '@deriv/hooks';
import { isMobile } from '@deriv/shared';
import { localize } from '@deriv/translations';
import { useStore, observer } from '@deriv/stores';
import './ready-to-verify-modal.scss';

const ReadyToVerifyModal = observer(() => {
    const { client, ui } = useStore();
    const {
        should_show_account_success_modal,
        setShouldTriggerTourGuide,
        toggleAccountSuccessModal,
        disableApp,
        enableApp,
        // openPOIPOAModal,
    } = ui;
    const { account_status } = client;

    const has_client_deposited = account_status?.status?.some(
        status => status === 'unwelcome' || status === 'withdrawal_locked' || status === 'cashier_locked'
    );

    const onConfirmeModal = () => {
        toggleAccountSuccessModal();
        // openPOIPOAModal(); // route to poi-poa modal
    };

    const onClose = () => {
        toggleAccountSuccessModal();
        setShouldTriggerTourGuide(true); // route to onboarding -switch accounts
    };

    return (
        <Dialog
            className='ready-to-verify-dialog'
            title={has_client_deposited ? localize('Successfully deposited') : localize('Account added')}
            confirm_button_text={localize('Verify now')}
            onConfirm={onConfirmeModal}
            cancel_button_text={localize('Maybe later')}
            onCancel={onClose}
            disableApp={disableApp}
            enableApp={enableApp}
            is_visible={should_show_account_success_modal}
            dismissable={true}
            has_close_icon={false}
            onEscapeButtonCancel={onClose}
        >
            <Text align='center' size={isMobile() ? 'xxs' : 'xs'}>
                {has_client_deposited
                    ? localize(
                          'Your funds will be available for trading once the verification of your account is complete.'
                      )
                    : localize(
                          'Your account will be available for trading once the verification of your account is complete.'
                      )}
            </Text>
        </Dialog>
    );
});

export default ReadyToVerifyModal;
