import React          from 'react';
import PropTypes      from 'prop-types';
import { localize }   from 'App/i18n';
import FullPageModal  from 'App/Components/Elements/FullPageModal/full-page-modal.jsx';
import Localize       from 'App/Components/Elements/localize.jsx';

const MarketUnavailableModal = ({
    is_visible,
    onCancel,
    onConfirm,
}) => (
    <FullPageModal
        cancel_button_text={localize('Go to SmartTrader')}
        confirm_button_text={localize('No, stay on Deriv')}
        is_visible={is_visible}
        onCancel={onCancel}
        onConfirm={onConfirm}
        title={localize('Market is unavailable')}
    >
        <Localize i18n_default_text='Sorry, but this market is not supported yet on Deriv. Do you want to trade this market on SmartTrader?' />
    </FullPageModal>
);

MarketUnavailableModal.propTypes = {
    is_visible: PropTypes.bool,
    onCancel  : PropTypes.func,
    onConfirm : PropTypes.func,
};

export default MarketUnavailableModal;
