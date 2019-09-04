import React         from 'react';
import PropTypes     from 'prop-types';
import { localize }  from 'App/i18n';
import { Dialog }    from 'deriv-components';
import Localize      from 'App/Components/Elements/localize.jsx';
import { connect }   from 'Stores/connect';

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
        confirm_button_text={localize('Continue with Virtual Account')}
        cancel_button_text={localize('Back to main website')}
        onConfirm={onConfirm}
        onCancel={onCancel}
        disableApp={disableApp}
        enableApp={enableApp}
        is_loading={is_loading}
        is_closed_on_cancel={false}
        is_visible={is_visible}
    >
        <Localize i18n_default_text='You cannot use your real money account with Deriv at this time.' />
    </Dialog>
);

DenialOfServiceModal.propTypes = {
    disableApp: PropTypes.bool,
    enableApp : PropTypes.bool,
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
