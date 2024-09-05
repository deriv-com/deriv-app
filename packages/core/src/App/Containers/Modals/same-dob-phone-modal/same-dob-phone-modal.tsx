import React from 'react';
import { useDevice } from '@deriv-com/ui';
import { Button, MobileDialog, Modal } from '@deriv/components';
import { observer, useStore } from '@deriv/stores';
import { Localize } from '@deriv/translations';
import { SameDOBPhoneModalContent } from './same-dob-phone-modal-content';
import './same-dob-phone-modal.scss';

const SameDOBPhoneModal = observer(() => {
    const { isDesktop } = useDevice();
    const { ui } = useStore();
    const { should_show_same_dob_phone_modal, setShouldShowSameDOBPhoneModal } = ui;

    const onCloseModal = () => {
        setShouldShowSameDOBPhoneModal(false);
    };

    return (
        <React.Fragment>
            {isDesktop ? (
                <Modal
                    is_open={should_show_same_dob_phone_modal}
                    className='same-dob-phone-modal'
                    title=' '
                    toggleModal={onCloseModal}
                    width='440px'
                    has_close_icon
                    should_header_stick_body={false}
                >
                    <SameDOBPhoneModalContent />
                    <Modal.Footer has_separator>
                        <Button large primary onClick={onCloseModal}>
                            <Localize i18n_default_text='OK' />
                        </Button>
                    </Modal.Footer>
                </Modal>
            ) : (
                <MobileDialog
                    visible={should_show_same_dob_phone_modal}
                    portal_element_id='modal_root'
                    onClose={onCloseModal}
                    title=''
                    has_full_height
                    footer={
                        <Modal.Footer has_separator>
                            <Button primary large wide onClick={onCloseModal}>
                                <Localize i18n_default_text='OK' />
                            </Button>
                        </Modal.Footer>
                    }
                >
                    <SameDOBPhoneModalContent />
                </MobileDialog>
            )}
        </React.Fragment>
    );
});

export default SameDOBPhoneModal;
