import React         from 'react';
import PropTypes     from 'prop-types';
import { localize }  from '_common/localize';
import URL           from '_common/url';
import FullPageModal from 'App/Components/Elements/FullPageModal/full-page-modal.jsx';
import Localize      from 'App/Components/Elements/localize.jsx';
import { connect }   from 'Stores/connect';

const MarketUnavailableModal = ({ is_visible, setHasOnlyForwardingContracts }) => (
    <FullPageModal
        cancel_button_text={localize('Go to SmartTrader')}
        confirm_button_text={localize('No, stay on BinaryNex')}
        is_visible={is_visible}
        onCancel={() => window.open(URL.websiteUrl()) && setHasOnlyForwardingContracts(false)}
        onConfirm={() => setHasOnlyForwardingContracts(false)}
        title={localize('Market is unavailable')}
    >
        <Localize str='Sorry, but this market is not supported yet on BinaryNex. Do you want to trade this market on SmartTrader?' />
    </FullPageModal>
);

MarketUnavailableModal.propTypes = {
    is_visible                   : PropTypes.bool,
    setHasOnlyForwardingContracts: PropTypes.func,
};

const market_unavailable = connect(
    ({ ui }) => ({
        is_visible                   : ui.has_only_forward_starting_contracts,
        setHasOnlyForwardingContracts: ui.setHasOnlyForwardingContracts,
    }),
)(MarketUnavailableModal);
export default market_unavailable;
