import React from 'react';
import { withRouter } from 'react-router-dom';
import { routes } from '@deriv/shared';
import TogglePositions from 'App/Components/Elements/TogglePositions';
import { connect } from 'Stores/connect';

type TradeFooterExtensionsProps = {
    active_positions_count: number;
    is_logged_in: boolean;
    is_positions_drawer_on: boolean;
    location: unknown;
    populateFooterExtensions: () => void;
    togglePositionsDrawer: () => void;
};

const TradeFooterExtensions = ({
    active_positions_count,
    is_logged_in,
    is_positions_drawer_on,
    location,
    populateFooterExtensions,
    togglePositionsDrawer,
}: TradeFooterExtensionsProps) => {
    React.useEffect(() => populateFooter());
    // eslint-disable-next-line react-hooks/exhaustive-deps
    React.useEffect(() => () => populateFooterExtensions([]), []);

    const TogglePositionsIcon = () => (
        <TogglePositions
            is_open={is_positions_drawer_on}
            togglePositions={togglePositionsDrawer}
            positions_count={active_positions_count}
        />
    );

    const populateFooter = () => {
        const show_positions_toggle = location.pathname === routes.trade;

        if (is_logged_in && show_positions_toggle) {
            populateFooterExtensions([
                {
                    position: 'left',
                    Component: TogglePositionsIcon,
                },
            ]);
        } else {
            populateFooterExtensions([]);
        }
    };

    return null;
};

export default connect(({ client, modules, ui }) => ({
    active_positions_count: modules.portfolio.active_positions_count,
    is_logged_in: client.is_logged_in,
    is_positions_drawer_on: ui.is_positions_drawer_on,
    populateFooterExtensions: ui.populateFooterExtensions,
    togglePositionsDrawer: ui.togglePositionsDrawer,
}))(withRouter(TradeFooterExtensions));
