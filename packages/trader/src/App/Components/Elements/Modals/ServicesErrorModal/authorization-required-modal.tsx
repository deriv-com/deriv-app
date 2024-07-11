import React from 'react';
import { Button, Modal } from '@deriv-lib/components';
import { getLanguage, localize } from '@deriv-lib/translations';
import { redirectToLogin, redirectToSignUp } from '@deriv-lib/shared';

type TAuthorizationRequiredModal = {
    is_visible: boolean;
    toggleModal: () => void;
    is_logged_in: boolean;
};

const AuthorizationRequiredModal = ({ is_visible, toggleModal, is_logged_in }: TAuthorizationRequiredModal) => (
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
            <Button has_effect text={localize('Create free account')} onClick={() => redirectToSignUp()} primary />
        </Modal.Footer>
    </Modal>
);

export default AuthorizationRequiredModal;
