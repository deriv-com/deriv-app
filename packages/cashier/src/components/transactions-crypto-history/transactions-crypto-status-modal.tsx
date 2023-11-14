import React from 'react';
import { Button, Modal } from '@deriv/components';
import { localize } from '@deriv/translations';
import { observer } from '@deriv/stores';
import { useCashierStore } from '../../stores/useCashierStores';

const TransactionsCryptoStatusModal = observer(() => {
    const { transaction_history } = useCashierStore();
    const {
        hideTransactionsCryptoStatusModal,
        is_transactions_crypto_status_modal_visible: is_status_modal_visible,
        selected_crypto_status,
        selected_crypto_status_description,
    } = transaction_history;

    return (
        <React.Fragment>
            <Modal
                small
                title={selected_crypto_status}
                is_open={is_status_modal_visible}
                toggleModal={hideTransactionsCryptoStatusModal}
                has_close_icon={false}
            >
                <Modal.Body>{selected_crypto_status_description}</Modal.Body>
                <Modal.Footer>
                    <Button text={localize('OK')} onClick={hideTransactionsCryptoStatusModal} large primary />
                </Modal.Footer>
            </Modal>
        </React.Fragment>
    );
});

export default TransactionsCryptoStatusModal;
