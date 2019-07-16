import React         from 'react';
import PropTypes     from 'prop-types';
import { localize }  from 'App/i18n';
import FullPageModal from 'App/Components/Elements/FullPageModal/full-page-modal.jsx';
import { title }     from './constants';

const ServicesErrorModal = ({
    is_visible,
    onConfirm,
    services_error,
}) => {
    const { code, message } = services_error;

    if (!code || !message) return null;

    return (
        <FullPageModal
            title={title[services_error.type]}
            confirm_button_text={localize('OK')}
            onConfirm={onConfirm}
            // TODO: handle onCancel
            // cancel_button_text={cancel_button_text}
            // onCancel={onCancel}
            is_visible={is_visible}
        >
            {message}
        </FullPageModal>
    );
};

ServicesErrorModal.propTypes = {
    is_visible    : PropTypes.bool,
    onConfirm     : PropTypes.func,
    services_error: PropTypes.object,
};

export default ServicesErrorModal;
