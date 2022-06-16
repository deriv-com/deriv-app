import React from 'react';
import PropTypes from 'prop-types';
import { Button, Modal } from '@deriv/components';
import { localize } from '@deriv/translations';
import { connect } from 'Stores/connect';

const CryptoTransactionsStatusModal = ({
    hideCryptoTransactionsStatusModal,
    is_status_modal_visible,
    selected_crypto_status,
    selected_crypto_status_description,
}) => {
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

CryptoTransactionsStatusModal.propTypes = {
    hideCryptoTransactionsStatusModal: PropTypes.func,
    is_status_modal_visible: PropTypes.bool,
    selected_crypto_status: PropTypes.string,
    selected_crypto_status_description: PropTypes.string,
};

export default connect(({ modules }) => ({
    hideCryptoTransactionsStatusModal: modules.cashier.transaction_history.hideCryptoTransactionsStatusModal,
    is_status_modal_visible: modules.cashier.transaction_history.is_crypto_transactions_status_modal_visible,
    selected_crypto_status: modules.cashier.transaction_history.selected_crypto_status,
    selected_crypto_status_description: modules.cashier.transaction_history.selected_crypto_status_description,
}))(CryptoTransactionsStatusModal);
