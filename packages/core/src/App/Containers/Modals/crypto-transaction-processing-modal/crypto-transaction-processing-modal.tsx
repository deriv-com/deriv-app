import React from 'react';
import { useDevice } from '@deriv-com/ui';
import { Button, MobileDialog, Modal } from '@deriv/components';
import { observer, useStore } from '@deriv/stores';
import { Localize } from '@deriv/translations';
import { CryptoTransactionProcessingModalContent } from './crypto-transaction-processing-modal-content';
import './crypto-transaction-processing-modal.scss';

const CryptoTransactionProcessingModal = observer(() => {
    const { isDesktop } = useDevice();
    const { ui } = useStore();
    const { should_show_crypto_transaction_processing_modal, setShouldShowCryptoTransactionProcessingModal } = ui;

    const onCloseModal = () => {
        setShouldShowCryptoTransactionProcessingModal(false);
    };

    return (
        <React.Fragment>
            {isDesktop ? (
                <Modal
                    is_open={should_show_crypto_transaction_processing_modal}
                    className='crypto-transaction-processing-modal'
                    title=' '
                    toggleModal={onCloseModal}
                    height='440px'
                    width='440px'
                    has_close_icon
                    should_header_stick_body={false}
                >
                    <CryptoTransactionProcessingModalContent />
                    <Modal.Footer has_separator>
                        <Button large primary onClick={onCloseModal}>
                            <Localize i18n_default_text='OK' />
                        </Button>
                    </Modal.Footer>
                </Modal>
            ) : (
                <MobileDialog
                    visible={should_show_crypto_transaction_processing_modal}
                    portal_element_id='modal_root'
                    wrapper_classname='crypto-transaction-processing-modal'
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
                    <CryptoTransactionProcessingModalContent />
                </MobileDialog>
            )}
        </React.Fragment>
    );
});

export default CryptoTransactionProcessingModal;
