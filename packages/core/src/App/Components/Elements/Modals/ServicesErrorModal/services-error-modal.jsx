import { Dialog }    from 'deriv-components';
import PropTypes     from 'prop-types';
import React         from 'react';
import { localize }  from 'deriv-translations';
import { connect }   from 'Stores/connect';
import { title }     from './constants';

const ServicesErrorModal = ({
    disableApp,
    enableApp,
    is_loading,
    is_visible,
    onConfirm,
    services_error,
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
    disableApp    : PropTypes.func,
    enableApp     : PropTypes.func,
    is_loading    : PropTypes.bool,
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
