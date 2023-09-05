import React from 'react';
import { Dialog } from '@deriv/components';
import { Localize, localize } from '@deriv/translations';
import { useStore, observer } from '@deriv/stores';
import './information-submitted-modal.scss';

const InformationSubmittedModal = observer(() => {
    const { ui } = useStore();
    const { is_information_submitted_modal_open: is_open, toggleInformationSubmittedModal, disableApp, enableApp } = ui;

    return (
        <Dialog
            className='information-submitted-modal'
            title={localize('Information updated')}
            confirm_button_text={localize('Close')}
            onConfirm={toggleInformationSubmittedModal}
            is_closed_on_cancel
            disableApp={disableApp}
            enableApp={enableApp}
            is_closed_on_confirm
            is_visible={is_open}
            dismissable={true}
            has_close_icon
            onEscapeButtonCancel={toggleInformationSubmittedModal}
        >
            <Localize i18n_default_text='Thank you for submitting your information.' />
        </Dialog>
    );
});

export default InformationSubmittedModal;
