import React from 'react';
import { Button, Modal } from '@deriv/components';
import { localize, Localize } from '@deriv/translations';
import { useStore, observer } from '@deriv/stores';

const CryptoTransactionsCancelModal = observer(() => {
    const {
        modules: {
            cashier: { transaction_history },
        },
    } = useStore();
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
                title={localize('Cancel transaction')}
                is_open={is_cancel_modal_visible}
                toggleModal={hideCryptoTransactionsCancelModal}
                has_close_icon
            >
                <Modal.Body>
                    <Localize i18n_default_text='Are you sure you want to cancel this transaction?' />
                </Modal.Body>
                <Modal.Footer>
                    <Button text={localize('No')} onClick={hideCryptoTransactionsCancelModal} large secondary />
                    <Button
                        text={localize('Yes')}
                        onClick={() => {
                            cancelCryptoTransaction(selected_crypto_transaction_id);
                        }}
                        large
                        primary
                    />
                </Modal.Footer>
            </Modal>
        </React.Fragment>
    );
});

export default CryptoTransactionsCancelModal;
