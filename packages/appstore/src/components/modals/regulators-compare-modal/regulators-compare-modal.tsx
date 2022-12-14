import React from 'react';
import { observer } from 'mobx-react-lite';
import { useStores } from 'Stores';
import { localize } from '@deriv/translations';
import RegulatorsCompareModalContent from './regulators-compare-modal-content';
import { Modal, DesktopWrapper, MobileDialog, MobileWrapper, UILoader } from '@deriv/components';

const RegulatorsCompareModal = () => {
    const { tradinghub, ui } = useStores();
    const { is_regulators_compare_modal_visible, toggleRegulatorsCompareModal } = tradinghub;
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
                    title={localize('Non-EU and EU regulator')}
                    toggleModal={closeModal}
                    type='button'
                    height='792px'
                    width='792px'
                    className='regulator-modal'
                >
                    <div className='regulator-modal__separator' />
                    <RegulatorsCompareModalContent />
                </Modal>
            </DesktopWrapper>
            <MobileWrapper>
                <MobileDialog
                    portal_element_id='deriv_app'
                    title={localize('Non-EU and EU regulator')}
                    wrapper_classname='regulator-modal'
                    visible={is_regulators_compare_modal_visible}
                    onClose={closeModal}
                >
                    <div className='regulator-modal__separator' />
                    <RegulatorsCompareModalContent />
                </MobileDialog>
            </MobileWrapper>
        </React.Suspense>
    );
};

export default observer(RegulatorsCompareModal);
