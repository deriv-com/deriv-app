import { Dialog }             from 'deriv-components';
import PropTypes              from 'prop-types';
import React                  from 'react';
import { localize, Localize } from 'deriv-translations';
import { connect }            from 'Stores/connect';
import { website_name }       from 'App/Constants/app-config';

const MarketUnavailableModal = ({
    disableApp,
    enableApp,
    is_loading,
    is_visible,
    onCancel,
    onConfirm,
}) => (
    <Dialog
        cancel_button_text={localize('Go to SmartTrader')}
        confirm_button_text={localize('No, stay on {{website_name}}', { website_name })}
        is_visible={is_visible}
        onCancel={onCancel}
        onConfirm={onConfirm}
        disableApp={disableApp}
        enableApp={enableApp}
        is_loading={is_loading}
        title={localize('Market is unavailable')}
    >
        <Localize i18n_default_text='Sorry, but this market is not supported yet on {{website_name}}. Do you want to trade this market on SmartTrader?' values={{ website_name }} />
    </Dialog>
);

MarketUnavailableModal.propTypes = {
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
)(MarketUnavailableModal);
