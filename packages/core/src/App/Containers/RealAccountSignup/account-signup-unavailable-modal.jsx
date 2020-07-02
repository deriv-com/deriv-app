import React from 'react';
import { Button, Modal } from '@deriv/components';
import { localize } from '@deriv/translations';

const AccountSignupUnavailableModal = ({ is_visible, toggleModal }) => (
    <Modal is_open={is_visible} small toggleModal={toggleModal}>
        <Modal.Body>
            {localize(
                'Account creation is currently unavailable for mobile. Please log in with your computer to create a new account.'
            )}
        </Modal.Body>
        <Modal.Footer>
            <Button has_effect text={localize('OK')} onClick={toggleModal} primary />
        </Modal.Footer>
    </Modal>
);

export default AccountSignupUnavailableModal;
