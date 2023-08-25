import React from 'react';
import PropTypes from 'prop-types';
import { Icon, Modal, Text } from '@deriv/components';
import { useModalManagerContext } from 'Components/modal-manager/modal-manager-context';
import { Localize } from 'Components/i18next';

const EmailLinkBlockedModal = ({
    // TODO: Uncomment when time is available in BE response
    // blocked_for_minutes,
    email_link_blocked_modal_error_message,
}) => {
    const { hideModal, is_modal_open } = useModalManagerContext();

    return (
        <Modal has_close_icon is_open={is_modal_open} renderTitle={() => <></>} toggleModal={hideModal} width='440px'>
            <Modal.Body className='email-link-blocked-modal'>
                <Icon icon='IcEmailVerificationLinkBlocked' size='128' />
                <Text className='email-link-blocked-modal--text' color='prominent' size='s' weight='bold'>
                    <Localize i18n_default_text='Too many failed attempts' />
                </Text>
                <Text align='center' color='prominent' size='s'>
                    {email_link_blocked_modal_error_message}
                </Text>
            </Modal.Body>
        </Modal>
    );
};

EmailLinkBlockedModal.propTypes = {
    // TODO: Uncomment when time is available in BE response
    // blocked_for_minutes: PropTypes.number,
    email_link_blocked_modal_error_message: PropTypes.string,
};

export default EmailLinkBlockedModal;
