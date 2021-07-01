import PropTypes from 'prop-types';
import React from 'react';
import { Button, Modal } from '@deriv/components';
import { getLanguage, localize } from '@deriv/translations';
import { redirectToLogin, redirectToSignUp } from '@deriv/shared';

const AuthorizationRequiredModal = ({ is_visible, toggleModal, is_dashboard, is_logged_in }) => (
    <Modal
        id='dt_authorization_required_modal'
        is_open={is_visible}
        small
        toggleModal={toggleModal}
        title={localize('Start trading with us')}
    >
        <Modal.Body>{localize('Log in or create a free account to place a trade.')}</Modal.Body>
        <Modal.Footer>
            <Button
                has_effect
                text={localize('Log in')}
                onClick={() => redirectToLogin(is_logged_in, getLanguage())}
                secondary
            />
            <Button
                has_effect
                text={localize('Create free account')}
                onClick={() => redirectToSignUp({ is_dashboard })}
                primary
            />
        </Modal.Footer>
    </Modal>
);

AuthorizationRequiredModal.propTypes = {
    is_dashboard: PropTypes.bool,
    is_visible: PropTypes.bool,
    is_logged_in: PropTypes.bool,
    toggleModal: PropTypes.func,
};

export default AuthorizationRequiredModal;
