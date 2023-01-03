import React from 'react';
import PropTypes from 'prop-types';
import { Button, Modal, Text, Icon } from '@deriv/components';
import { localize, Localize } from '@deriv/translations';

const UnlinkAccountModal = ({ onClose, is_open, identifier_title, onClickSendEmail }) => {
    const onClickUnlinkButton = () => {
        onClose();
        onClickSendEmail();
    };

    return (
        <Modal className={'unlink-account__modal'} is_open={is_open} has_close_icon toggleModal={onClose} width='440px'>
            <Modal.Body>
                <div onClick={onClose} className='unlink-account__modal-close'>
                    <Icon icon='IcCross' />
                </div>
                <div className='unlink-account__modal-icon'>
                    <Icon icon='IcEmailChanged' size={128} />
                </div>
                <div className='unlink-account__modal-content'>
                    <Text className='unlink-account__modal-title' weight='bold' size='s'>
                        <Localize i18n_default_text='Change your login email' />
                    </Text>
                    <Text className='unlink-account__modal-description' size='xs'>
                        <Localize
                            i18n_default_text="To change your email address, you'll first need to unlink your email address from your {{identifier_title}} account."
                            values={{ identifier_title }}
                        />
                    </Text>
                </div>
            </Modal.Body>
            <Modal.Footer className='unlink-account__footer'>
                <Button onClick={onClose} has_effect text={localize('Cancel')} secondary large />
                <Button onClick={onClickUnlinkButton} has_effect primary large>
                    <Localize i18n_default_text='Unlink from {{identifier_title}}' values={{ identifier_title }} />
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

UnlinkAccountModal.prototypes = {
    onClose: PropTypes.func,
    is_open: PropTypes.bool,
    identifier_title: PropTypes.string,
    onClickSendEmail: PropTypes.func,
};

export default UnlinkAccountModal;
