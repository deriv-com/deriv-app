import React from 'react';
import { Button, Modal } from '@deriv/components';
import { localize, Localize } from '@deriv/translations';
import { isMobile, routes } from '@deriv/shared';
import { useHistory } from 'react-router-dom';

type TAccountVerificationRequiredModalProps = {
    is_visible: boolean;
    onConfirm: () => void;
};

const AccountVerificationRequiredModal = ({ is_visible, onConfirm }: TAccountVerificationRequiredModalProps) => {
    const history = useHistory();
    return (
        <Modal
            is_open={is_visible}
            is_vertical_centered={isMobile()}
            toggleModal={onConfirm}
            title={localize('Account verification required')}
            width='440px'
            height='200px'
        >
            <Modal.Body>
                <Localize i18n_default_text='Please submit your proof of identity and proof of address to verify your account and continue trading.' />
            </Modal.Body>
            <Modal.Footer>
                <Button
                    has_effect
                    text={localize('Submit Proof')}
                    onClick={() => history.push(routes.proof_of_identity)}
                    primary
                />
            </Modal.Footer>
        </Modal>
    );
};

export default AccountVerificationRequiredModal;
