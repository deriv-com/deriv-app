import React from 'react';
import PropTypes from 'prop-types';
import { Icon, Modal, Text } from '@deriv/components';
import { Localize } from 'Components/i18next';

const EmailLinkBlockedModal = ({
    blocked_for_minutes = 30,
    is_email_link_blocked_modal_open = true,
    setIsEmailLinkBlockedModalOpen = () => {},
}) => {
    return (
        <Modal
            has_close_icon
            is_open={is_email_link_blocked_modal_open}
            title=''
            toggleModal={() => setIsEmailLinkBlockedModalOpen(false)}
            width='440px'
        >
            <Modal.Body className='email-link-blocked-modal'>
                <Icon icon='IcEmailVerificationLinkBlocked' size='128' />
                <Text className='email-link-blocked-modal--text' color='prominent' size='s' weight='bold'>
                    <Localize i18n_default_text='Too many failed attempts' />
                </Text>
                <Text className='email-link-blocked-modal--blocked_text' color='prominent' size='s'>
                    <Localize
                        i18n_default_text='We have temporarily blocked your request after too many failed attempts. Please try again after {{blocked_for_minutes}} minutes.'
                        values={{ blocked_for_minutes }}
                    />
                </Text>
            </Modal.Body>
        </Modal>
    );
};

EmailLinkBlockedModal.propTypes = {
    blocked_for_minutes: PropTypes.number,
    is_email_link_blocked_modal_open: PropTypes.bool,
    setIsEmailLinkBlockedModalOpen: PropTypes.func,
};

export default EmailLinkBlockedModal;
