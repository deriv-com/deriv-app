import PropTypes from 'prop-types';
import React from 'react';
import { withRouter } from 'react-router-dom';
import { Dialog } from '@deriv/components';
import { routes } from '@deriv/shared';
import { localize, Localize } from '@deriv/translations';
import { connect } from 'Stores/connect';

const MT5ServerErrorDialog = ({
    account_type,
    clearMt5Error,
    disableApp,
    enableApp,
    error_message,
    has_mt5_error,
    history,
    error_type,
    createMT5Account,
    failed_password_attempts,
    is_mt5_success_dialog_enabled,
}) => {
    const should_show_error = has_mt5_error && !is_mt5_success_dialog_enabled;
    const MAX_FAILED_ATTEMPT = 2;
    const is_password_reset = error_type === 'PasswordReset';
    const is_password_error = error_type === 'PasswordError';
    const is_try_again_enabled = is_password_error && failed_password_attempts <= MAX_FAILED_ATTEMPT;
    const title = error_type !== 'PasswordReset' ? localize('Something’s not right') : '';
    const confirm_label = is_password_reset ? localize('Reset password') : localize('OK');

    const handleConfirm = () => {
        if (is_password_reset) {
            history.push(routes.deriv_password);
        }
        clearMt5Error();
    };

    return (
        <Dialog
            title={title}
            confirm_button_text={confirm_label}
            cancel_button_text={is_try_again_enabled ? localize('Try again') : undefined}
            onConfirm={handleConfirm}
            onCancel={is_try_again_enabled ? () => createMT5Account(account_type) : undefined}
            disableApp={disableApp}
            enableApp={enableApp}
            is_visible={should_show_error}
            is_closed_on_cancel
            is_content_centered={is_password_reset}
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
    failed_password_attempts: modules.mt5.failed_password_attempts,
    createMT5Account: modules.mt5.createMT5Account,
}))(withRouter(MT5ServerErrorDialog));
