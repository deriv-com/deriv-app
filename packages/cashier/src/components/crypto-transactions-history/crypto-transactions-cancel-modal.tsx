import React from 'react';
import { Button, Modal, Text } from '@deriv/components';
import { localize, Localize } from '@deriv/translations';
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
                is_open={is_cancel_modal_visible}
                toggleModal={hideCryptoTransactionsCancelModal}
                shouldCloseOnEscape
            >
                <Text line_height={is_mobile ? 's' : 'm'} size={is_mobile ? 'xs' : 's'} weight='bold'>
                    <Localize i18n_default_text='Cancel transaction' />
                </Text>
                <Text line_height={is_mobile ? 'm' : 's'} size={is_mobile ? 'xxs' : 'xs'}>
                    <Localize i18n_default_text='Are you sure you want to cancel this transaction?' />
                </Text>
                <div className='crypto-transactions-cancel-modal-buttons-container'>
                    <Button
                        text={localize("No, don't cancel")}
                        onClick={hideCryptoTransactionsCancelModal}
                        large
                        secondary
                    />
                    <Button
                        text={localize('Yes, cancel')}
                        onClick={() => {
                            cancelCryptoTransaction(selected_crypto_transaction_id);
                        }}
                        large
                        primary
                    />
                </div>
            </Modal>
        </React.Fragment>
    );
});

export default CryptoTransactionsCancelModal;
