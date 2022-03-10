import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'Stores/connect';
import { Button, Modal, Text, Icon } from '@deriv/components';
import { localize, Localize, getLanguage } from '@deriv/translations';
import { redirectToLogin } from '@deriv/shared';

const SuccessModal = ({ is_visible, toggleSuccessEmailModal, logoutClient }) => {
    const onClickButton = () => {
        toggleSuccessEmailModal(false);
        logoutClient().then(() => {
            redirectToLogin(false, getLanguage(), false);
        });
    };

    return (
        <Modal is_open={is_visible} has_close_icon toggleModal={toggleSuccessEmailModal} width='440px'>
            <React.Fragment>
                <Icon className='change-email-success__modal-icon' icon={`IcEmailVerified`} size={128} />
                <Text className='change-email-success__modal-title' weight='bold' size='s'>
                    <Localize i18n_default_text='Success!' />
                </Text>
                <Text className='change-email-success__modal-description' size='xs'>
                    <Localize i18n_default_text='Your email has been successfully changed.' />
                </Text>
                <Modal.Footer className='change-email-success__footer'>
                    <Button onClick={onClickButton} has_effect text={localize('Got it')} primary large />
                </Modal.Footer>
            </React.Fragment>
        </Modal>
    );
};

SuccessModal.prototypes = {
    toggleSuccessEmailModal: PropTypes.func,
    is_visible: PropTypes.bool,
    logoutClient: PropTypes.func,
};

export default connect(({ ui, client }) => ({
    logoutClient: client.logout,
    is_visible: ui.is_success_email_modal_visible,
    toggleSuccessEmailModal: ui.toggleSuccessEmailModal,
}))(SuccessModal);
