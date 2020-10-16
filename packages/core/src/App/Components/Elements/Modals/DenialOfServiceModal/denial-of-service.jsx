import PropTypes from 'prop-types';
import React from 'react';
import { Dialog } from '@deriv/components';
import { localize, Localize } from '@deriv/translations';
import { connect } from 'Stores/connect';
import { website_name } from '@deriv/shared';

const DenialOfServiceModal = ({ disableApp, enableApp, is_loading, is_visible, onCancel, onConfirm }) => (
    <Dialog
        title={localize("That's not ready yet!")}
        confirm_button_text={localize('Stay on {{website_domain}}', { website_domain: website_name })}
        cancel_button_text={localize('Go to Binary.com')}
        onConfirm={onConfirm}
        onCancel={onCancel}
        disableApp={disableApp}
        enableApp={enableApp}
        is_loading={is_loading}
        is_closed_on_cancel={false}
        is_visible={is_visible}
    >
        <Localize i18n_default_text='Real money accounts are currently unavailable.' />
    </Dialog>
);

DenialOfServiceModal.propTypes = {
    disableApp: PropTypes.func,
    enableApp: PropTypes.func,
    is_loading: PropTypes.bool,
    is_visible: PropTypes.bool,
    onCancel: PropTypes.func,
    onConfirm: PropTypes.func,
};

export default connect(({ ui }) => ({
    disableApp: ui.disableApp,
    enableApp: ui.enableApp,
    is_loading: ui.is_loading,
}))(DenialOfServiceModal);
