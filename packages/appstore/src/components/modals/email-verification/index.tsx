import React from 'react';
import { localize, Localize } from '@deriv/translations';
import { Text, Dialog } from '@deriv/components';
import { useStore } from '@deriv/stores';

const EmailVerificationModal = () => {
    const { traders_hub, ui, client } = useStore();

    return (
        <Dialog
            confirm_button_text={localize('Didn’t receive the email?')}
            is_closed_on_cancel
            is_closed_on_confirm
            is_visible
            className='failed-verification-modal'
        >
            <Text>
                Please check your email apple.seed@deriv.com for the verification link. Click on the link to confirm
                your email address to continue creating your Deriv account.
            </Text>
        </Dialog>
    );
};

export default EmailVerificationModal;
