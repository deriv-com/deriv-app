import React from 'react';
import { Button, Modal, Text } from '@deriv/components';
import { Localize } from '@deriv/translations';
import { observer, useStore } from '@deriv/stores';
import { useCashierStore } from '../../stores/useCashierStores';
import './crypto-transactions-cancel-modal.scss';

const CryptoTransactionsCancelModal = observer(() => {
    const {
        ui: { is_mobile },
    } = useStore();
    const { transaction_history } = useCashierStore();
    const {
        cancelCryptoTransaction,
        hideCryptoTransactionsCancelModal,
        is_crypto_transactions_cancel_modal_visible: is_cancel_modal_visible,
        selected_crypto_transaction_id,
    } = transaction_history;

    return (
        <React.Fragment>
            <Modal
                small
                className='crypto-transactions-cancel-modal'
                title={<Localize i18n_default_text='Cancel transaction' />}
                is_open={is_cancel_modal_visible}
                toggleModal={hideCryptoTransactionsCancelModal}
                has_close_icon={false}
                shouldCloseOnEscape
            >
                <Modal.Body className='crypto-transactions-cancel-modal__body'>
                    <Localize i18n_default_text='Are you sure you want to cancel this transaction?' />
                </Modal.Body>
                <Modal.Footer className='crypto-transactions-cancel-modal__footer'>
                    <Button onClick={hideCryptoTransactionsCancelModal} large secondary>
                        <Localize i18n_default_text="No, don't cancel" />
                    </Button>
                    <Button
                        onClick={() => {
                            cancelCryptoTransaction(selected_crypto_transaction_id);
                        }}
                        large
                        primary
                    >
                        <Localize i18n_default_text='Yes, cancel' />
                    </Button>
                </Modal.Footer>
            </Modal>
        </React.Fragment>
    );
});

export default CryptoTransactionsCancelModal;
