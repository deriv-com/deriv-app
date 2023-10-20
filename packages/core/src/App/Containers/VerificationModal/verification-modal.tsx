import React from 'react';
import { DesktopWrapper, MobileDialog, MobileWrapper, Modal, UILoader } from '@deriv/components';
import { observer, useStore } from '@deriv/stores';
import VerificationModalContent from './verification-modal-content';

import './verification-modal.scss';
import { localize } from '@deriv/translations';

const VerificationModal = observer(() => {
    const { ui } = useStore();
    const { is_verification_modal_visible, setIsVerificationModalVisible, setIsVerificationSubmitted } = ui;

    return (
        <React.Suspense fallback={<UILoader />}>
            <DesktopWrapper>
                <Modal
                    className='verification-modal'
                    is_open={is_verification_modal_visible}
                    title={localize('Submit your proof of identity and address')}
                    toggleModal={() => setIsVerificationModalVisible(false)}
                    height='70rem'
                    width='99.6rem'
                    exit_classname='verification-modal--custom-exit'
                >
                    <VerificationModalContent
                        onFinish={() => {
                            setIsVerificationModalVisible(false);
                            setIsVerificationSubmitted(true);
                        }}
                    />
                </Modal>
            </DesktopWrapper>
            <MobileWrapper>
                <MobileDialog
                    portal_element_id='deriv_app'
                    title={localize('Submit your proof of identity and address')}
                    wrapper_classname='verification-modal'
                    visible={is_verification_modal_visible}
                    onClose={() => setIsVerificationModalVisible(false)}
                >
                    <VerificationModalContent
                        onFinish={() => {
                            setIsVerificationModalVisible(false);
                            setIsVerificationSubmitted(true);
                        }}
                    />
                </MobileDialog>
            </MobileWrapper>
        </React.Suspense>
    );
});

export default VerificationModal;
