import React from 'react';
import { useDevice } from '@deriv-com/ui';
import { Dialog, Text } from '@deriv/components';
import { useHasMFAccountDeposited } from '@deriv/hooks';
import { Localize, localize } from '@deriv/translations';
import { useStore, observer } from '@deriv/stores';
import './deposit-now-or-later-modal.scss';

const DepositNowOrLaterModal = observer(() => {
    const { isMobile } = useDevice();
    const { ui } = useStore();
    const {
        should_show_deposit_now_or_later_modal,
        setShouldShowDepositNowOrLaterModal,
        setShouldShowOneTimeDepositModal,
        // setShouldTriggerTourGuide,
        // toggleAccountSuccessModal,
        // setIsVerificationModalVisible,
        // setIsFromSuccessDepositModal,
    } = ui;

    const onConfirmModal = () => {
        // if (has_mf_account_deposited) {
        //     setIsFromSuccessDepositModal(true);
        // }
        // toggleAccountSuccessModal();
        // setIsVerificationModalVisible(true); // route to poi-poa modal
        setShouldShowDepositNowOrLaterModal(false);
    };

    const onClose = () => {
        // toggleAccountSuccessModal();
        // setShouldTriggerTourGuide(true); // route to onboarding -switch accounts
        setShouldShowDepositNowOrLaterModal(false);
        setShouldShowOneTimeDepositModal(false);
    };

    return (
        <Dialog
            className='deposit-now-or-later-modal'
            title={<Localize i18n_default_text='Add funds and start trading' />}
            confirm_button_text={localize('Deposit now')}
            onConfirm={onConfirmModal}
            cancel_button_text={localize('Deposit later')}
            onCancel={onClose}
            is_visible={should_show_deposit_now_or_later_modal}
            has_close_icon
            is_closed_on_cancel={false}
            onEscapeButtonCancel={onClose}
        >
            <Text align='center' size={isMobile ? 'xxs' : 'xs'}>
                <Localize i18n_default_text="Make a deposit to trade the world's markets!" />
            </Text>
        </Dialog>
    );
});

export default DepositNowOrLaterModal;
