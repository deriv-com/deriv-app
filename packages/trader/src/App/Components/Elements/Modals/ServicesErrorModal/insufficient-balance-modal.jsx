import { Button, Modal } from '@deriv/components';
import PropTypes from 'prop-types';
import React from 'react';
import { withRouter } from 'react-router-dom';
import { localize } from '@deriv/translations';
import routes from 'Constants/routes';

const InsufficientBalanceModal = ({ history, is_virtual, is_visible, message, toggleModal }) => (
    <Modal
        id='dt_insufficient_balance_modal'
        is_open={is_visible}
        small
        toggleModal={toggleModal}
        title={localize('Insufficient balance')}
    >
        <Modal.Body>{message}</Modal.Body>
        <Modal.Footer>
            <Button
                has_effect
                text={is_virtual ? localize('OK') : localize('Deposit now')}
                onClick={() => {
                    if (!is_virtual) {
                        history.push(routes.cashier_deposit);
                    }
                    toggleModal();
                }}
                primary
            />
        </Modal.Footer>
    </Modal>
);

InsufficientBalanceModal.propTypes = {
    history: PropTypes.object,
    is_virtual: PropTypes.bool,
    is_visible: PropTypes.bool,
    message: PropTypes.string,
    toggleModal: PropTypes.func,
};

export default withRouter(InsufficientBalanceModal);
