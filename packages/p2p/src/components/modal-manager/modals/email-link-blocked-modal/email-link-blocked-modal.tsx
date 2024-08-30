import React from 'react';
import { Icon, Modal, Text } from '@deriv/components';
import { useStores } from 'Stores';
import { Localize } from 'Components/i18next';
import { useModalManagerContext } from 'Components/modal-manager/modal-manager-context';

type TEmailLinkBlockedModalProps = {
    email_link_blocked_modal_error_message: string;
};

const EmailLinkBlockedModal = ({
    // TODO: Uncomment when time is available in BE response
    // blocked_for_minutes,
    email_link_blocked_modal_error_message,
}: TEmailLinkBlockedModalProps) => {
    const { order_store } = useStores();
    const { hideModal, is_modal_open } = useModalManagerContext();

    return (
        <Modal
            is_open={is_modal_open}
            renderTitle={() => <></>}
            toggleModal={() => {
                hideModal({ should_hide_all_modals: true });
                order_store.setIsVerifyingEmail(false);
            }}
            width='440px'
        >
            <Modal.Body className='email-link-blocked-modal'>
                <Icon icon='IcEmailVerificationLinkBlocked' size='128' />
                <Text className='email-link-blocked-modal__text' color='prominent' weight='bold'>
                    <Localize i18n_default_text='Too many failed attempts' />
                </Text>
                <Text align='center' color='prominent'>
                    {email_link_blocked_modal_error_message}
                </Text>
            </Modal.Body>
        </Modal>
    );
};

export default EmailLinkBlockedModal;
