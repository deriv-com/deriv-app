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
            className='account-verification-required-modal'
            toggleModal={onConfirm}
            title={localize('Account verification required')}
            width='440px'
            height={isMobile() ? 'auto' : '220px'}
        >
            <Modal.Body className='account-verification-required-modal-text'>
                <Localize i18n_default_text='Please submit your proof of identity and proof of address to verify your account and continue trading.' />
            </Modal.Body>

            <div className='account-verification-required-modal-button'>
                <Modal.Footer>
                    <Button
                        has_effect
                        text={localize('Submit Proof')}
                        onClick={() => history.push(routes.proof_of_identity)}
                        primary
                    />
                </Modal.Footer>
            </div>
        </Modal>
    );
};

export default AccountVerificationRequiredModal;
