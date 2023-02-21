import React from 'react';
import { localize } from '@deriv/translations';
import { Modal, FormSubmitButton, Text } from '@deriv/components';

const WarningMessageModal = ({
    is_closing_create_real_account_modal,
    setIsClosingCreateRealAccountModal,
    closeRealAccountSignup,
}) => (
    <Modal
        id='close_real_acc_modal'
        portalId='modal_root_absolute'
        is_open={is_closing_create_real_account_modal}
        has_close_icon={false}
    >
        <div className='close-real-acc-modal'>
            <Text line_height='x' weight='bold' className='close-real-acc-modal__warning-message'>
                {localize("You haven't finished creating your account")}
            </Text>
            <div className='close-real-acc-modal__content-wrapper'>
                <Text size='xs' as='p' align='left' className='close-real-acc-modal__content'>
                    {localize('If you leave close this window, you will lose any information you have entered.')}
                </Text>
            </div>
            <FormSubmitButton
                is_disabled={false}
                label={localize('Continue creating account')}
                className='close-real-acc-modal__close-account-button'
                has_cancel
                cancel_label={localize('Close this window')}
                onClick={() => setIsClosingCreateRealAccountModal(false)}
                onCancel={() => {
                    setIsClosingCreateRealAccountModal(false);
                    closeRealAccountSignup();
                }}
            />
        </div>
    </Modal>
);

export default WarningMessageModal;
