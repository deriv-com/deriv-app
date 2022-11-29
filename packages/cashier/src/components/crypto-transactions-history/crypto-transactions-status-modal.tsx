import React from 'react';
import { observer } from 'mobx-react-lite';
import { Button, Modal } from '@deriv/components';
import { localize } from '@deriv/translations';
import { useStore } from '@deriv/stores';

const CryptoTransactionsStatusModal = () => {
    const {
        modules: {
            cashier: { transaction_history },
        },
    } = useStore();
    const {
        hideCryptoTransactionsStatusModal,
        is_crypto_transactions_status_modal_visible: is_status_modal_visible,
        selected_crypto_status,
        selected_crypto_status_description,
    } = transaction_history;

    return (
        <React.Fragment>
            <Modal
                small
                title={selected_crypto_status}
                is_open={is_status_modal_visible}
                toggleModal={hideCryptoTransactionsStatusModal}
                has_close_icon={false}
            >
                <Modal.Body>{selected_crypto_status_description}</Modal.Body>
                <Modal.Footer>
                    <Button text={localize('OK')} onClick={hideCryptoTransactionsStatusModal} large primary />
                </Modal.Footer>
            </Modal>
        </React.Fragment>
    );
};

export default observer(CryptoTransactionsStatusModal);
