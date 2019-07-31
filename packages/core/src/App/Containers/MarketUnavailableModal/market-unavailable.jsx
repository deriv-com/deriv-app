import React          from 'react';
import PropTypes      from 'prop-types';
import { localize }   from 'App/i18n';
import { urlFor }     from '_common/url';
import FullPageModal  from 'App/Components/Elements/FullPageModal/full-page-modal.jsx';
import Localize       from 'App/Components/Elements/localize.jsx';
import { connect }    from 'Stores/connect';

const MarketUnavailableModal = ({
    is_visible,
    // resetPreviousSymbol,
    setHasOnlyForwardingContracts,
}) => (
    <FullPageModal
        cancel_button_text={localize('Go to SmartTrader')}
        confirm_button_text={localize('No, stay on Deriv')}
        is_visible={is_visible}
        onCancel={() => window.open(urlFor('trading', undefined, undefined, true)) && setHasOnlyForwardingContracts(false)}
        onConfirm={() => { setHasOnlyForwardingContracts(false);/* resetPreviousSymbol(); */ }}
        title={localize('Market is unavailable')}
    >
        <Localize i18n_default_text='Sorry, but this market is not supported yet on Deriv. Do you want to trade this market on SmartTrader?' />
    </FullPageModal>
);

MarketUnavailableModal.propTypes = {
    is_visible                   : PropTypes.bool,
    setHasOnlyForwardingContracts: PropTypes.func,
};

const market_unavailable = connect(
    ({ ui/* , modules */ }) => ({
        is_visible                   : ui.has_only_forward_starting_contracts,
        setHasOnlyForwardingContracts: ui.setHasOnlyForwardingContracts,
        // resetPreviousSymbol          : modules.trade.resetPreviousSymbol,
    }),
)(MarketUnavailableModal);
export default market_unavailable;
