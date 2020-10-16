import PropTypes from 'prop-types';
import React from 'react';
import { useHistory } from 'react-router-dom';
import { Dialog } from '@deriv/components';
import { routes } from '@deriv/shared';
import { localize } from '@deriv/translations';
import { connect } from 'Stores/connect';

const AccountTransferLimit = ({ disableApp, enableApp, is_loading, is_visible, message, toggleModal }) => {
    const history = useHistory();
    return (
        <Dialog
            title={localize('Please verify your identity')}
            confirm_button_text={localize('Verify identity')}
            cancel_button_text={localize('Cancel')}
            onConfirm={() => {
                history.push(routes.proof_of_identity);
                toggleModal(false);
            }}
            onCancel={() => toggleModal(false)}
            disableApp={disableApp}
            enableApp={enableApp}
            is_loading={is_loading}
            is_closed_on_cancel={false}
            is_visible={is_visible}
            portal_element_id='modal_root'
        >
            {message}
        </Dialog>
    );
};

AccountTransferLimit.propTypes = {
    disableApp: PropTypes.func,
    enableApp: PropTypes.func,
    is_loading: PropTypes.bool,
    is_visible: PropTypes.bool,
    toggleModal: PropTypes.func,
};

export default connect(({ ui }) => ({
    disableApp: ui.disableApp,
    enableApp: ui.enableApp,
    is_loading: ui.is_loading,
    is_visible: ui.is_account_transfer_limit_modal_visible,
    message: ui.account_transfer_limit_message,
    toggleModal: ui.toggleAccountTransferLimitModal,
}))(AccountTransferLimit);
