import PropTypes from 'prop-types';
import React from 'react';
import { Dialog } from '@deriv/components';
import { localize, Localize } from '@deriv/translations';
import { connect } from 'Stores/connect';

const MarketUnavailableModal = ({ disableApp, enableApp, is_loading, is_visible, onCancel, onConfirm }) => (
    <Dialog
        className='market-unavailable-modal'
        title={localize('We’re working on it')}
        confirm_button_text={localize('Stay on DTrader')}
        cancel_button_text={localize('Go to SmartTrader')}
        onConfirm={onConfirm}
        onCancel={onCancel}
        is_mobile_full_width={false}
        is_visible={is_visible}
        disableApp={disableApp}
        enableApp={enableApp}
        is_loading={is_loading}
    >
        <Localize i18n_default_text='This market is not yet available on DTrader, but it is on SmartTrader.' />
    </Dialog>
);

MarketUnavailableModal.propTypes = {
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
}))(MarketUnavailableModal);
