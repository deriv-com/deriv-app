import React from 'react';
import { Button, Modal, Text } from '@deriv/components';
import { localize, Localize } from '@deriv/translations';

export const UnlinkModal = ({ onClose, identifier_title, is_open, onClickSendEmail }) => {
    return (
        <Modal
            is_open={is_open}
            should_header_stick_body
            title={
                <Localize
                    i18n_default_text='Are you sure you want to unlink from {{identifier_title}}?'
                    values={{ identifier_title }}
                />
            }
            toggleModal={onClose}
            width='440px'
        >
            <React.Fragment>
                <Text className='sent-email__modal-unlink-title' size='xs'>
                    {localize('You will need to set a password to complete the process.')}
                </Text>
                <Modal.Footer>
                    <Button onClick={onClose} has_effect text={localize('Cancel')} secondary large />
                    <Button has_effect onClick={onClickSendEmail} primary large>
                        <Localize i18n_default_text='Unlink from {{identifier_title}}' values={{ identifier_title }} />
                    </Button>
                </Modal.Footer>
            </React.Fragment>
        </Modal>
    );
};
