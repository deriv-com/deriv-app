import PropTypes from 'prop-types';
import React from 'react';
import { Button, Modal } from '@deriv/components';
import { localize } from '@deriv/translations';
import { redirectToLogin, redirectToSignUp } from '_common/base/login';

const AuthorizationRequiredModal = ({ is_visible, toggleModal, is_logged_in }) => (
    <Modal
        id='dt_authorization_required_modal'
        is_open={is_visible}
        small
        toggleModal={toggleModal}
        title={localize('Start trading with us')}
    >
        <Modal.Body>{localize('Log in or create a free account to place a trade.')}</Modal.Body>
        <Modal.Footer>
            <Button has_effect text={localize('Log in')} onClick={() => redirectToLogin(is_logged_in)} secondary />
            <Button has_effect text={localize('Create free account')} onClick={redirectToSignUp} primary />
        </Modal.Footer>
    </Modal>
);

AuthorizationRequiredModal.propTypes = {
    is_visible: PropTypes.bool,
    is_logged_in: PropTypes.bool,
    toggleModal: PropTypes.func,
};

export default AuthorizationRequiredModal;
