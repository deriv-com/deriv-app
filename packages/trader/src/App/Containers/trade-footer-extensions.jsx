import PropTypes from 'prop-types';
import React from 'react';
import { withRouter } from 'react-router-dom';
import { routes } from '@deriv/shared';
import TogglePositions from 'App/Components/Elements/TogglePositions';
import { observer, useStore } from '@deriv/stores';

const TradeFooterExtensions = observer(() => {
    const { client, portfolio, ui } = useStore();
    const { is_logged_in } = client;
    const { active_positions_count } = portfolio;
    const { is_positions_drawer_on, populateFooterExtensions, togglePositionsDrawer } = ui;
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
});

TradeFooterExtensions.propTypes = {
    location: PropTypes.object,
};

export default withRouter(TradeFooterExtensions);
