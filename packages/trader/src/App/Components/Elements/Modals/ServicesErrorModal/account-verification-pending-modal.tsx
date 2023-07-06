import React from 'react';
import { Button, Modal } from '@deriv/components';
import { localize, Localize } from '@deriv/translations';
import { isMobile } from '@deriv/shared';

type TAccountVerificationPendingdModal = {
    is_visible: boolean;
    onConfirm: () => void;
};

const AccountVerificationPendingdModal = ({ is_visible, onConfirm }: TAccountVerificationPendingdModal) => {
    return (
        <Modal
            small
            is_open={is_visible}
            title={localize('Pending verification')}
            toggleModal={onConfirm}
            width={isMobile() ? '328px' : '440px'}
            height={isMobile() ? '178px' : '200px'}
            className='account-verification-pending-modal'
        >
            <Modal.Body>
                <Localize i18n_default_text='You cannot trade as your documents are still under review. We will notify you by email once your verification is approved.' />
            </Modal.Body>
            <Modal.Footer>
                <Button
                    has_effect
                    text={localize('OK')}
                    onClick={onConfirm}
                    primary
                    className='account-verification-pending-modal-button'
                />
            </Modal.Footer>
        </Modal>
    );
};

export default AccountVerificationPendingdModal;
