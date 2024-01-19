import React, { useState } from 'react';
import { observer, useStore } from '@deriv/stores';
import { localize } from '@deriv/translations';
import RegulatorsCompareModalContent from './regulators-compare-modal-content';
import { Modal, DesktopWrapper, MobileDialog, MobileWrapper, UILoader, Text } from '@deriv/components';

const RegulatorsCompareModal = () => {
    const { traders_hub, ui, client } = useStore();
    const { is_logged_in } = client;
    const { is_regulators_compare_modal_visible, toggleRegulatorsCompareModal } = traders_hub;
    const { disableApp, enableApp } = ui;
    const [show_modal, setShowModal] = useState(is_logged_in);
    const closeModal = () => {
        setShowModal(false);
        toggleRegulatorsCompareModal();
    };
    console.log(show_modal, is_logged_in);
    return (
        <React.Suspense fallback={<UILoader />}>
            <DesktopWrapper>
                <Modal
                    disableApp={disableApp}
                    enableApp={enableApp}
                    is_open={show_modal}
                    title={localize('Verify mobile number')}
                    toggleModal={closeModal}
                    large
                >
                    <Modal.Body>
                        <Text>verify your mobile number</Text>
                    </Modal.Body>
                </Modal>
            </DesktopWrapper>
            <MobileWrapper>
                <MobileDialog
                    portal_element_id='deriv_app'
                    title={localize('Non-EU and EU regulation')}
                    visible={is_regulators_compare_modal_visible}
                    onClose={closeModal}
                >
                    <RegulatorsCompareModalContent />
                </MobileDialog>
            </MobileWrapper>
        </React.Suspense>
    );
};

export default observer(RegulatorsCompareModal);
