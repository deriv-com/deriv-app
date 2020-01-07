import { Button, Modal }          from '@deriv/components';
import PropTypes                  from 'prop-types';
import React                      from 'react';
import { localize }               from '@deriv/translations';
import { title }                  from './constants';
import AuthorizationRequiredModal from './authorization-required-modal.jsx';
import InsufficientBalanceModal   from './insufficient-balance-modal.jsx';

const ServicesErrorModal = ({
    is_visible,
    onConfirm,
    services_error,
}) => {
    const { code, message } = services_error;

    if (!code || !message) return null;

    if (code === 'AuthorizationRequired') {
        return (
            <AuthorizationRequiredModal
                is_visible={is_visible}
                toggleModal={onConfirm}
            />
        );
    }
    if (code === 'InsufficientBalance') {
        return (
            <InsufficientBalanceModal
                is_visible={is_visible}
                message={message}
                toggleModal={onConfirm}
            />
        );
    }
    return (
        <Modal
            is_open={is_visible}
            small
            title={title[services_error.type]}
            toggleModal={onConfirm}
        >
            <Modal.Body>
                {message}
            </Modal.Body>
            <Modal.Footer>
                <Button
                    has_effect
                    text={localize('OK')}
                    onClick={onConfirm}
                    primary
                />
            </Modal.Footer>
        </Modal>
    );
};

ServicesErrorModal.propTypes = {
    is_visible    : PropTypes.bool,
    onConfirm     : PropTypes.func,
    services_error: PropTypes.object,
};

export default ServicesErrorModal;
