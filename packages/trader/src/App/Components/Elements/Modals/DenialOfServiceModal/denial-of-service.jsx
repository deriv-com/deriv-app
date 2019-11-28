import { Dialog }             from 'deriv-components';
import PropTypes              from 'prop-types';
import React                  from 'react';
import { localize, Localize } from 'deriv-translations';
import { connect }            from 'Stores/connect';
import { website_name }       from 'App/Constants/app-config';

const DenialOfServiceModal = ({
    disableApp,
    enableApp,
    is_loading,
    is_visible,
    onCancel,
    onConfirm,
}) => (
    <Dialog
        title={localize('Whoops!')}
        confirm_button_text={localize('Continue with Demo Account')}
        cancel_button_text={localize('Back to main website')}
        onConfirm={onConfirm}
        onCancel={onCancel}
        disableApp={disableApp}
        enableApp={enableApp}
        is_loading={is_loading}
        is_closed_on_cancel={false}
        is_visible={is_visible}
    >
        <Localize i18n_default_text='You cannot use your real money account with {{website_name}} at this time.' values={{ website_name }} />
    </Dialog>
);

DenialOfServiceModal.propTypes = {
    disableApp: PropTypes.func,
    enableApp : PropTypes.func,
    is_loading: PropTypes.bool,
    is_visible: PropTypes.bool,
    onCancel  : PropTypes.func,
    onConfirm : PropTypes.func,
};

export default connect(
    ({ ui }) => ({
        disableApp: ui.disableApp,
        enableApp : ui.enableApp,
        is_loading: ui.is_loading,
    }),
)(DenialOfServiceModal);
