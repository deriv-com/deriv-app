import React from 'react';
import PropTypes from 'prop-types';
import { Button, Modal } from '@deriv/components';
import { localize, Localize } from '@deriv/translations';
import { connect } from 'Stores/connect';

const CryptoTransactionsModal = ({cancelCryptoTransaction, is_cancel_modal_open, onClickModalCancel, selected_transaction_id}) => {
    return (
        <React.Fragment>
            <Modal
                small
                title={localize('Cancel transaction')}
                is_open={is_cancel_modal_open}
                toggleModal={onClickModalCancel}
                has_close_icon
            >
                <Modal.Body>
                    <Localize i18n_default_text='Are you sure you want to cancel this transaction?' />
                </Modal.Body>
                <Modal.Footer>
                    <Button text={localize('No')} onClick={onClickModalCancel} large secondary />
                    <Button
                        text={localize('Yes')}
                        onClick={() => {
                            cancelCryptoTransaction(selected_transaction_id);
                        }}
                        large
                        primary
                    />
                </Modal.Footer>
            </Modal>
        </React.Fragment>
    );
};

CryptoTransactionsModal.propTypes = {
    cancelCryptoTransaction: PropTypes.func,
    is_cancel_modal_open: PropTypes.bool,
    onClickModalCancel: PropTypes.func,
    selected_transaction_id: PropTypes.string,
};

export default connect(({ modules }) => ({
    cancelCryptoTransaction: modules.cashier.cancelCryptoTransaction,
    is_cancel_modal_open: modules.cashier.is_cancel_modal_open,
    onClickModalCancel: modules.cashier.onClickModalCancel,
    selected_transaction_id: modules.cashier.selected_transaction_id,
}))(CryptoTransactionsModal);