import React from 'react';
import { observer, useStore } from '@deriv/stores';
import { Localize } from '@deriv/translations';
import RegulatorsCompareModalContent from './regulators-compare-modal-content';
import { Modal, DesktopWrapper, MobileDialog, MobileWrapper, UILoader } from '@deriv/components';
import './regulators-compare-modal.scss';

const RegulatorsCompareModal = () => {
    const { traders_hub, ui } = useStore();
    const { is_regulators_compare_modal_visible, toggleRegulatorsCompareModal } = traders_hub;
    const { disableApp, enableApp } = ui;
    const closeModal = () => {
        toggleRegulatorsCompareModal();
    };

    return (
        <React.Suspense fallback={<UILoader />}>
            <DesktopWrapper>
                <Modal
                    disableApp={disableApp}
                    enableApp={enableApp}
                    is_open={is_regulators_compare_modal_visible}
                    title={<Localize i18n_default_text='Non-EU and EU regulation' />}
                    toggleModal={closeModal}
                    height='792px'
                    width='792px'
                >
                    <RegulatorsCompareModalContent />
                </Modal>
            </DesktopWrapper>
            <MobileWrapper>
                <MobileDialog
                    portal_element_id='deriv_app'
                    title={<Localize i18n_default_text='Non-EU and EU regulation' />}
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
