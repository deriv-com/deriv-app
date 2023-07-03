import React from 'react';
import { withRouter } from 'react-router-dom';
import { DesktopWrapper, MobileDialog, MobileWrapper, Modal, UILoader } from '@deriv/components';
import { observer, useStore } from '@deriv/stores';
import VerificationModalContent from './verification-modal-content';
import './verification-modal.scss';

type TVerificationModal = {
    is_from_external?: boolean;
    onStateChange?: () => void;
};

const VerificationModal = observer(({ is_from_external, onStateChange }: TVerificationModal) => {
    const { ui } = useStore();
    const { is_verification_modal_visible, setIsVerificationModalVisible } = ui;
    return (
        <React.Suspense fallback={<UILoader />}>
            <DesktopWrapper>
                <Modal
                    className='verification-modal'
                    is_open={is_verification_modal_visible}
                    title='Submit your proof of identity and address'
                    toggleModal={() => setIsVerificationModalVisible(false)}
                    height='700px'
                    width='996px'
                    exit_classname='verification-modal--custom-exit'
                >
                    <VerificationModalContent is_from_external={is_from_external} onStateChange={onStateChange} />
                </Modal>
            </DesktopWrapper>
            <MobileWrapper>
                <MobileDialog
                    portal_element_id='deriv_app'
                    title='Submit your proof of identity and address'
                    wrapper_classname='verification-modal'
                    visible={is_verification_modal_visible}
                    onClose={() => setIsVerificationModalVisible(false)}
                >
                    <VerificationModalContent is_from_external={is_from_external} onStateChange={onStateChange} />
                </MobileDialog>
            </MobileWrapper>
        </React.Suspense>
    );
});

export default withRouter(VerificationModal);
