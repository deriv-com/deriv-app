import PropTypes from 'prop-types';
import React from 'react';
import { Dialog } from '@deriv/components';
import { localize, Localize } from '@deriv/translations';
import { connect } from 'Stores/connect';

const CFDServerErrorDialog = ({
    clearCFDError,
    disableApp,
    enableApp,
    error_message,
    error_type,
    has_cfd_error,
    is_cfd_success_dialog_enabled,
}) => {
    const should_show_error =
        has_cfd_error && !is_cfd_success_dialog_enabled && !['PasswordReset', 'PasswordError'].includes(error_type);
    return (
        <Dialog
            title={localize('Something’s not right')}
            confirm_button_text={localize('OK')}
            onConfirm={clearCFDError}
            disableApp={disableApp}
            enableApp={enableApp}
            is_visible={should_show_error}
        >
            {error_message || <Localize i18n_default_text='Sorry, an error occured while processing your request.' />}
        </Dialog>
    );
};

CFDServerErrorDialog.propTypes = {
    clearCFDError: PropTypes.func,
    disableApp: PropTypes.func,
    enableApp: PropTypes.func,
    error_message: PropTypes.string,
    has_cfd_error: PropTypes.bool,
    is_cfd_success_dialog_enabled: PropTypes.bool,
};

export default connect(({ ui, modules }) => ({
    clearCFDError: modules.cfd.clearCFDError,
    disableApp: ui.disableApp,
    enableApp: ui.enableApp,
    error_message: modules.cfd.error_message,
    error_type: modules.cfd.error_type,
    has_cfd_error: modules.cfd.has_cfd_error,
    is_cfd_success_dialog_enabled: modules.cfd.is_cfd_success_dialog_enabled,
}))(CFDServerErrorDialog);
