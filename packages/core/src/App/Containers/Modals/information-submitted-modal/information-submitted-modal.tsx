import React from 'react';
import { Dialog } from '@deriv-lib/components';
import { Localize, localize } from '@deriv-lib/translations';
import { useStore, observer } from '@deriv-lib/stores';

const InformationSubmittedModal = observer(() => {
    const { ui } = useStore();
    const { is_kyc_information_submitted_modal_open: is_open, toggleKycInformationSubmittedModal } = ui;

    return (
        <Dialog
            className='information-submitted-modal'
            title={localize('Information updated')}
            confirm_button_text={localize('Close')}
            onConfirm={toggleKycInformationSubmittedModal}
            is_visible={is_open}
            dismissable
            has_close_icon
            onEscapeButtonCancel={toggleKycInformationSubmittedModal}
        >
            <Localize i18n_default_text='Thank you for submitting your information.' />
        </Dialog>
    );
});

export default InformationSubmittedModal;
