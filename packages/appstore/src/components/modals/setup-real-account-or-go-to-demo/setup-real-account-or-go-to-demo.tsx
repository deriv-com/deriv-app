import React, { useState } from 'react';
import { observer, useStore } from '@deriv/stores';
import { Localize } from '@deriv/translations';
import { Button, DesktopWrapper, MobileWrapper, Modal, MobileDialog, Icon, Text } from '@deriv/components';
import './setup-real-account-or-go-to-demo.scss';

const ModalContent = ({ is_responsive = false }: { is_responsive?: boolean }) => {
    return (
        <div className='setup-real-account-or-go-to-demo'>
            <Icon icon='IcAppstoreAccount' width={120} height={152} />
            <div className='setup-real-account-or-go-to-demo__title-and-description'>
                <Text
                    size={is_responsive ? 'sm' : 'm'}
                    weight='bold'
                    className='setup-real-account-or-go-to-demo__title'
                >
                    <Localize i18n_default_text='Start your trading journey' />
                </Text>
                <Text>
                    <Localize i18n_default_text='Your demo account is ready.' />
                </Text>
            </div>
            <div className='setup-real-account-or-go-to-demo__buttons'>
                <Button primary large>
                    <Localize i18n_default_text='Set up your real account' />
                </Button>
                <Button secondary large>
                    <Localize i18n_default_text='Go to demo' />
                </Button>
            </div>
        </div>
    );
};

const SetupRealAccountOrGoToDemo = observer(() => {
    const { ui } = useStore();
    const { is_from_signup_account } = ui;

    const [show_modal, setShowModal] = useState(true);

    const closeModal = () => {
        setShowModal(prev => !prev);
    };

    return (
        <React.Fragment>
            <DesktopWrapper>
                <Modal is_open={show_modal} toggleModal={closeModal} width='400px'>
                    <ModalContent />
                </Modal>
            </DesktopWrapper>
            <MobileWrapper>
                <MobileDialog
                    portal_element_id='modal_root'
                    visible={show_modal}
                    onClose={closeModal}
                    has_close_icon={false}
                    has_full_height
                    header_classname='setup-real-account-or-go-to-demo__responsive-header'
                    wrapper_classname='setup-real-account-or-go-to-demo__responsive-wrapper'
                >
                    <ModalContent is_responsive />
                </MobileDialog>
            </MobileWrapper>
        </React.Fragment>
    );
});

export default SetupRealAccountOrGoToDemo;
