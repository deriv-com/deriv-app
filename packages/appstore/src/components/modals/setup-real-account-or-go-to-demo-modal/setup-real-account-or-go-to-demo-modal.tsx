import React from 'react';
import { observer, useStore } from '@deriv/stores';
import { DesktopWrapper, MobileWrapper, Modal, MobileDialog } from '@deriv/components';
import { useGrowthbookGetFeatureValue } from '@deriv/hooks';
import { SetupRealAccountOrGoToDemoModalContent } from './setup-real-account-or-go-to-demo-modal-content';
import './setup-real-account-or-go-to-demo-modal.scss';

const SetupRealAccountOrGoToDemoModal = observer(() => {
    const { ui, traders_hub, client } = useStore();
    const { is_from_signup_account } = ui;
    const { has_active_real_account } = client;
    const { is_setup_real_account_or_go_to_demo_modal_visible, setIsSetupRealAccountOrGoToDemoModalVisible } =
        traders_hub;

    const [show_setup_real_or_go_demo] = useGrowthbookGetFeatureValue({
        featureFlag: 'show_setup_real_or_go_demo',
        defaultValue: true,
    });

    const show_modal =
        is_setup_real_account_or_go_to_demo_modal_visible &&
        !has_active_real_account &&
        is_from_signup_account &&
        show_setup_real_or_go_demo;

    const closeModal = () => {
        setIsSetupRealAccountOrGoToDemoModalVisible(false);
    };

    return (
        <React.Fragment>
            <DesktopWrapper>
                <Modal is_open={show_modal} toggleModal={closeModal} width='400px' has_close_icon={false}>
                    <SetupRealAccountOrGoToDemoModalContent />
                </Modal>
            </DesktopWrapper>
            <MobileWrapper>
                <MobileDialog
                    portal_element_id='modal_root'
                    visible={show_modal}
                    onClose={closeModal}
                    has_close_icon={false}
                    has_full_height
                    header_classname='setup-real-account-or-go-to-demo-modal__responsive-header'
                    wrapper_classname='setup-real-account-or-go-to-demo-modal__responsive-wrapper'
                >
                    <SetupRealAccountOrGoToDemoModalContent is_responsive />
                </MobileDialog>
            </MobileWrapper>
        </React.Fragment>
    );
});

export default SetupRealAccountOrGoToDemoModal;
