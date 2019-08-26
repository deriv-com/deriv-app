import React         from 'react';
import PropTypes     from 'prop-types';
import { localize }  from 'App/i18n';
import { Dialog }    from 'deriv-components';
import { title }     from './constants';
import { connect }   from 'Stores/connect';

const ServicesErrorModal = ({
    is_visible,
    onConfirm,
    services_error,
    disableApp,
    enableApp,
    is_loading
}) => {
    const { code, message } = services_error;

    if (!code || !message) return null;

    return (
        <Dialog
            title={title[services_error.type]}
            confirm_button_text={localize('OK')}
            onConfirm={onConfirm}
            // TODO: handle onCancel
            // cancel_button_text={cancel_button_text}
            // onCancel={onCancel}
            disableApp={disableApp}
            enableApp={enableApp}
            is_loading={is_loading}
            is_visible={is_visible}
        >
            {message}
        </Dialog>
    );
};

ServicesErrorModal.propTypes = {
    is_visible    : PropTypes.bool,
    onConfirm     : PropTypes.func,
    services_error: PropTypes.object,
};

export default connect(
    ({ ui }) => ({
        disableApp: ui.disableApp,
        enableApp : ui.enableApp,
        is_loading: ui.is_loading,
    }),
)(ServicesErrorModal);
