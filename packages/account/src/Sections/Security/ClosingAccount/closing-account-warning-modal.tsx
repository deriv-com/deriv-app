import React from 'react';
import { localize, Localize } from '@deriv/translations';
import { FormSubmitButton, Icon, Text } from '@deriv/components';

type TClosingAccountWarningModalProps = {
    closeModal: () => void;
    startDeactivating: () => void;
};

const ClosingAccountWarningModal = ({ closeModal, startDeactivating }: TClosingAccountWarningModalProps) => {
    return (
        <div className='account-closure-warning-modal'>
            <Icon icon='IcRedWarning' size={96} />
            <Text size='xs' line_height='x' weight='bold' className='account-closure-warning-modal__warning-message'>
                <Localize i18n_default_text='Close your account?' />
            </Text>
            <div className='account-closure-warning-modal__content-wrapper'>
                <Text as='p' align='center' className='account-closure-warning-modal__content'>
                    <Localize i18n_default_text='Closing your account will automatically log you out. We shall delete your personal information as soon as our legal obligations are met.' />
                </Text>
            </div>
            <FormSubmitButton
                is_disabled={false}
                label={localize('Close account')}
                className='account-closure-warning-modal__close-account-button'
                has_cancel
                cancel_label={localize('Go Back')}
                onClick={() => startDeactivating()}
                onCancel={() => closeModal()}
            />
        </div>
    );
};
export default ClosingAccountWarningModal;
