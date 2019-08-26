import React          from 'react';
import PropTypes      from 'prop-types';
import { localize }   from 'App/i18n';
import { Dialog }     from 'deriv-components';
import Localize       from 'App/Components/Elements/localize.jsx';
import { connect }    from 'Stores/connect';

const MarketUnavailableModal = ({
    is_visible,
    onCancel,
    onConfirm,
    disableApp,
    enableApp,
    is_loading
}) => (
    <Dialog
        cancel_button_text={localize('Go to SmartTrader')}
        confirm_button_text={localize('No, stay on Deriv')}
        is_visible={is_visible}
        onCancel={onCancel}
        onConfirm={onConfirm}
        disableApp={disableApp}
        enableApp={enableApp}
        is_loading={is_loading}
        title={localize('Market is unavailable')}
    >
        <Localize i18n_default_text='Sorry, but this market is not supported yet on Deriv. Do you want to trade this market on SmartTrader?' />
    </Dialog>
);

MarketUnavailableModal.propTypes = {
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
