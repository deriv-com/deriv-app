import React         from 'react';
import PropTypes     from 'prop-types';
import { localize }  from 'App/i18n';
import FullPageModal from 'App/Components/Elements/FullPageModal/full-page-modal.jsx';
import { connect }   from 'Stores/connect';
import { title }     from './constants';

const ServicesErrorModal = ({
    is_services_error_visible,
    resetPurchase,
    services_error,
    toggleServicesErrorModal,
}) => {
    const { code, message } = services_error;

    if (!code || !message) return null;

    return (
        <FullPageModal
            title={title[services_error.type]}
            confirm_button_text={localize('OK')}
            onConfirm={() => {
                toggleServicesErrorModal(false);
                if (services_error.type === 'buy') {
                    resetPurchase();
                }
            }}
            // TODO: handle onCancel
            // cancel_button_text={cancel_button_text}
            // onCancel={onCancel}
            is_visible={is_services_error_visible}
        >
            {message}
        </FullPageModal>
    );
};

ServicesErrorModal.propTypes = {
    is_services_error_visible: PropTypes.bool,
    resetPurchase            : PropTypes.func,
    services_error           : PropTypes.object,
    toggleServicesErrorModal : PropTypes.func,
};

export default connect (
    ({ common, modules, ui }) => ({
        services_error           : common.services_error,
        is_services_error_visible: ui.is_services_error_visible,
        toggleServicesErrorModal : ui.toggleServicesErrorModal,
        resetPurchase            : modules.trade.requestProposal,
    }),
)(ServicesErrorModal);
