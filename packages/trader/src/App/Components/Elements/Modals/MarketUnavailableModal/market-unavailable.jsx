import { Dialog }     from 'deriv-components';
import PropTypes      from 'prop-types';
import React          from 'react';
import { localize }   from 'App/i18n';
import Localize       from 'App/Components/Elements/localize.jsx';
import { connect }    from 'Stores/connect';

const MarketUnavailableModal = ({
    disableApp,
    enableApp,
    is_loading,
    is_visible,
    onCancel,
    onConfirm
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
