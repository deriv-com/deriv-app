import PropTypes from 'prop-types';
import React from 'react';
import { MobileWrapper } from '@deriv/components';
import { isMobile } from '@deriv/shared/utils/screen';
import TogglePositionsMobile from 'App/Components/Elements/TogglePositions/toggle-positions-mobile.jsx';
import { connect } from 'Stores/connect';

class TradeHeaderExtensions extends React.Component {
    populateHeader = () => {
        const {
            active_positions_count,
            disableApp,
            enableApp,
            is_logged_in,
            is_positions_empty,
            onPositionsRemove,
            onPositionsSell,
            positions,
            positions_currency,
            positions_error,
            populateHeaderExtensions,
        } = this.props;

        const header_items = is_logged_in && (
            <MobileWrapper>
                <TogglePositionsMobile
                    active_positions_count={active_positions_count}
                    all_positions={positions}
                    currency={positions_currency}
                    disableApp={disableApp}
                    is_empty={is_positions_empty}
                    enableApp={enableApp}
                    error={positions_error}
                    onClickSell={onPositionsSell}
                    onClickRemove={onPositionsRemove}
                />
            </MobileWrapper>
        );

        populateHeaderExtensions(header_items);
    };

    componentDidMount() {
        if (isMobile()) this.props.onMountPositions();
        this.populateHeader();
    }

    componentDidUpdate() {
        this.populateHeader();
    }

    componentWillUnmount() {
        if (isMobile()) this.props.onUnmountPositions();
        this.props.populateHeaderExtensions(null);
    }

    // eslint-disable-next-line class-methods-use-this
    render() {
        return null;
    }
}

TradeHeaderExtensions.propTypes = {
    is_logged_in: PropTypes.bool,
    populateHeaderExtensions: PropTypes.func,
};

export default connect(({ client, modules, ui }) => ({
    positions_currency: client.currency,
    is_logged_in: client.is_logged_in,
    positions: modules.portfolio.all_positions,
    positions_error: modules.portfolio.error,
    is_positions_empty: modules.portfolio.is_empty,
    onPositionsSell: modules.portfolio.onClickSell,
    onPositionsRemove: modules.portfolio.removePositionById,
    onMountPositions: modules.portfolio.onMount,
    onUnmountPositions: modules.portfolio.onUnmount,
    active_positions_count: modules.portfolio.active_positions_count,
    disableApp: ui.disableApp,
    enableApp: ui.enableApp,
    populateHeaderExtensions: ui.populateHeaderExtensions,
    toggleUnsupportedContractModal: ui.toggleUnsupportedContractModal,
}))(TradeHeaderExtensions);
