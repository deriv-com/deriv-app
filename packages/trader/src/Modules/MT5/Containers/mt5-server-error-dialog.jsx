import PropTypes from 'prop-types';
import React from 'react';
import { withRouter } from 'react-router-dom';
import { Dialog } from '@deriv/components';
import { localize, Localize } from '@deriv/translations';
import { connect } from 'Stores/connect';

const MT5ServerErrorDialog = ({
    clearMt5Error,
    disableApp,
    enableApp,
    error_message,
    has_mt5_error,
    error_type,
    is_mt5_success_dialog_enabled,
}) => {
    const should_show_error =
        has_mt5_error && !is_mt5_success_dialog_enabled && !['PasswordError', 'PasswordReset'].includes(error_type);
    const title = error_type !== 'PasswordReset' ? localize('Something’s not right') : '';
    const confirm_label = localize('OK');

    const handleConfirm = () => clearMt5Error();

    return (
        <Dialog
            title={title}
            confirm_button_text={confirm_label}
            onConfirm={handleConfirm}
            disableApp={disableApp}
            enableApp={enableApp}
            is_visible={should_show_error}
            is_closed_on_cancel
        >
            {error_message || <Localize i18n_default_text='Sorry, an error occurred while processing your request.' />}
        </Dialog>
    );
};

MT5ServerErrorDialog.propTypes = {
    clearMt5Error: PropTypes.func,
    disableApp: PropTypes.func,
    enableApp: PropTypes.func,
    error_message: PropTypes.string,
    has_mt5_error: PropTypes.bool,
    is_mt5_success_dialog_enabled: PropTypes.bool,
};

export default connect(({ ui, modules }) => ({
    account_type: modules.mt5.account_type,
    clearMt5Error: modules.mt5.clearMt5Error,
    disableApp: ui.disableApp,
    enableApp: ui.enableApp,
    error_message: modules.mt5.error_message,
    has_mt5_error: modules.mt5.has_mt5_error,
    is_mt5_success_dialog_enabled: modules.mt5.is_mt5_success_dialog_enabled,
    error_type: modules.mt5.error_type,
    createMT5Account: modules.mt5.createMT5Account,
}))(withRouter(MT5ServerErrorDialog));
