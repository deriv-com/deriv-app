import React from 'react';
import { Button, Modal } from '@deriv/components';
import { localize, Localize } from '@deriv/translations';
import { observer } from '@deriv/stores';
import { useCashierStore } from '../../stores/useCashierStores';

const TransactionsCryptoCancelModal = observer(() => {
    const { transaction_history } = useCashierStore();
    const {
        cancelCryptoTransaction,
        hideTransactionsCryptoCancelModal,
        is_transactions_crypto_cancel_modal_visible: is_cancel_modal_visible,
        selected_crypto_transaction_id,
    } = transaction_history;

    return (
        <React.Fragment>
            <Modal
                small
                title={localize('Cancel transaction')}
                is_open={is_cancel_modal_visible}
                toggleModal={hideTransactionsCryptoCancelModal}
                has_close_icon
            >
                <Modal.Body>
                    <Localize i18n_default_text='Are you sure you want to cancel this transaction?' />
                </Modal.Body>
                <Modal.Footer>
                    <Button text={localize('No')} onClick={hideTransactionsCryptoCancelModal} large secondary />
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

export default TransactionsCryptoCancelModal;
