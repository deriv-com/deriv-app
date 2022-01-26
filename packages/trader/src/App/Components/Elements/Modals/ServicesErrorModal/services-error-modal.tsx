import React from 'react';
import { Button, Modal } from '@deriv/components';
import { localize } from '@deriv/translations';
import { title } from './constants';
import AuthorizationRequiredModal from './authorization-required-modal.jsx';
import InsufficientBalanceModal from './insufficient-balance-modal.jsx';

type ServicesErrorModalProps = {
    is_visible: boolean;
    is_virtual: boolean;
    is_logged_in: boolean;
    onConfirm: () => void;
    services_error: unknown;
};

const ServicesErrorModal = ({
    is_virtual,
    is_visible,
    is_logged_in,
    onConfirm,
    services_error,
}: ServicesErrorModalProps) => {
    const { code, message } = services_error;

    if (!code || !message) return null;

    if (code === 'AuthorizationRequired') {
        return (
            <AuthorizationRequiredModal is_logged_in={is_logged_in} is_visible={is_visible} toggleModal={onConfirm} />
        );
    }
    if (code === 'InsufficientBalance') {
        return (
            <InsufficientBalanceModal
                is_virtual={is_virtual}
                is_visible={is_visible}
                message={message}
                toggleModal={onConfirm}
            />
        );
    }
    return (
        <Modal is_open={is_visible} small title={title[services_error.type]} toggleModal={onConfirm}>
            <Modal.Body>{message}</Modal.Body>
            <Modal.Footer>
                <Button has_effect text={localize('OK')} onClick={onConfirm} primary />
            </Modal.Footer>
        </Modal>
    );
};

export default ServicesErrorModal;
