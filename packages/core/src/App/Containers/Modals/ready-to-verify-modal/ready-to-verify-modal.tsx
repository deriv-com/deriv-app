import React from 'react';
import { Dialog, Text } from '@deriv/components';
import { useCashierLocked, useDepositLocked } from '@deriv/hooks';
import { localize } from '@deriv/translations';
import { useStore, observer } from '@deriv/stores';
import './ready-to-verify-modal.scss';

const ReadyToVerifyModal = observer(() => {
    const { ui } = useStore();
    const {
        should_show_account_success_modal,
        setShouldTriggerTourGuide,
        toggleAccountSuccessModal,
        disableApp,
        enableApp,
        setIsVerificationModalVisible,
        is_mobile,
    } = ui;
    const is_deposit_locked = useDepositLocked();
    const is_cashier_locked = useCashierLocked();

    const onConfirmModal = () => {
        toggleAccountSuccessModal();
        setIsVerificationModalVisible(true); // route to poi-poa modal
    };

    const onClose = () => {
        toggleAccountSuccessModal();
        setShouldTriggerTourGuide(true); // route to onboarding -switch accounts
    };
    const has_deposited_for_first_time = is_deposit_locked || is_cashier_locked;

    return (
        <Dialog
            className='ready-to-verify-dialog'
            title={has_deposited_for_first_time ? localize('Successfully deposited') : localize('Account added')}
            confirm_button_text={localize('Verify now')}
            onConfirm={onConfirmModal}
            cancel_button_text={localize('Maybe later')}
            onCancel={onClose}
            disableApp={disableApp}
            enableApp={enableApp}
            is_visible={should_show_account_success_modal}
            dismissable={true}
            has_close_icon={false}
            onEscapeButtonCancel={onClose}
        >
            <Text align='center' size={is_mobile ? 'xxs' : 'xs'}>
                {has_deposited_for_first_time
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
