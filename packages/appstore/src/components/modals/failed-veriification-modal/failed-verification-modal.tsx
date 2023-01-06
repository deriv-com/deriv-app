import React from 'react';
import { observer } from 'mobx-react-lite';
import { useStores } from 'Stores';
import { localize, Localize } from '@deriv/translations';
import { Button, DesktopWrapper, MobileDialog, MobileWrapper, Modal, Text, UILoader, Dialog } from '@deriv/components';
import { isMobile } from '@deriv/shared';

const FailedVerificationModal = () => {
    const {
        traders_hub,
        ui,
        modules: { cfd },
    } = useStores();
    // const { is_failed_verification_modal_visible, toggleFailedVerificationModalVisibility } = traders_hub;
    const { toggleCFDVerificationModal } = cfd;
    const { is_regulators_compare_modal_visible, toggleRegulatorsCompareModal } = traders_hub;
    const { disableApp, enableApp } = ui;
    const closeModal = () => {
        // toggleFailedVerificationModalVisibility();
        toggleRegulatorsCompareModal();
    };

    const onConfirmModal = () => {
        // toggleFailedVerificationModalVisibility();
        toggleRegulatorsCompareModal();
        toggleCFDVerificationModal();
    };
    const FailedVerificationModalContent = () => {
        return (
            <React.Fragment>
                <Text size={isMobile() ? 'xxs' : 'xs'}>
                    {localize('The following documents you submitted did not pass our checks:')}
                </Text>
                <div className='failed-verification-modal__failed_list'>
                    <Text
                        size={isMobile() ? 'xxs' : 'xs'}
                        line_height='xl'
                        className='failed-verification-modal__failed_list-item'
                    >
                        <Localize i18n_default_text='Proof of identity' />
                    </Text>
                    <Text
                        size={isMobile() ? 'xxs' : 'xs'}
                        line_height='xl'
                        className='failed-verification-modal__failed_list-item'
                    >
                        <Localize i18n_default_text='Proof of address.' />
                    </Text>
                </div>
                <Text size={isMobile() ? 'xxs' : 'xs'}>
                    {localize('If you’d like to get the MT5 CFDs account, resubmit these documents.')}
                </Text>
            </React.Fragment>
        );
    };

    return (
        // <React.Suspense fallback={<UILoader />}>
        //     <DesktopWrapper>
        //         <Modal
        //             disableApp={disableApp}
        //             enableApp={enableApp}
        //             is_open={is_regulators_compare_modal_visible}
        //             title={localize('Why did my verification fail?')}
        //             toggleModal={closeModal}
        //             height='316px'
        //             width='440px'
        //             className='failed-verification-modal'
        //         >
        //             <FailedVerificationModalContent />
        //         </Modal>
        //     </DesktopWrapper>
        //     <MobileWrapper>
        //         <MobileDialog
        //             portal_element_id='deriv_app'
        //             title={localize('Why did my verification fail?')}
        //             visible={is_regulators_compare_modal_visible}
        //             onClose={closeModal}
        //         >
        //             <FailedVerificationModalContent />
        //         </MobileDialog>
        //     </MobileWrapper>
        // </React.Suspense>

        <Dialog
            title={localize('Why did my verification fail?')}
            confirm_button_text={localize('Resubmit documents')}
            cancel_button_text={localize('Maybe later')}
            is_closed_on_cancel
            disableApp={disableApp}
            enableApp={enableApp}
            is_closed_on_confirm
            is_visible={is_regulators_compare_modal_visible}
            onCancel={closeModal}
            onConfirm={onConfirmModal}
            className='failed-verification-modal'
        >
            <FailedVerificationModalContent />
        </Dialog>
    );
};

export default observer(FailedVerificationModal);
