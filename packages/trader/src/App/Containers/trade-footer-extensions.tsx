import React from 'react';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import { routes } from '@deriv/shared';
import TogglePositions from '../Components/Elements/TogglePositions/toggle-positions';
import { observer, useStore } from '@deriv/stores';

const TradeFooterExtensions = observer((props: RouteComponentProps) => {
    const { location } = props;
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

export default withRouter(TradeFooterExtensions);
