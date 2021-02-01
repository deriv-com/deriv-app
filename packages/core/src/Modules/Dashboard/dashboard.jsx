import React from 'react';
import PropTypes, { any } from 'prop-types';
import DashboardComponent from '@deriv/dashboard';
import { routes, websiteUrl } from '@deriv/shared';
import { getLanguage } from '@deriv/translations';
import { WS } from 'Services';
import { connect } from 'Stores/connect';
import ServerTime from '_common/base/server_time';
import LoginPrompt from 'App/Components/Elements/login-prompt.jsx';
import Page404 from 'Modules/Page404';

const Dashboard = ({ client, config, ui }) => (
    <DashboardComponent client={client} server_time={ServerTime} ui={ui} ws={WS} config={config} />
);

Dashboard.propTypes = {
    client: PropTypes.shape({
        is_logged_in: PropTypes.bool.isRequired,
        loginid: PropTypes.string.isRequired,
    }).isRequired,
    config: {
        asset_path: PropTypes.string.isRequired,
        has_router: PropTypes.bool.isRequired,
        is_deriv_crypto: PropTypes.bool.isRequired,
        routes: PropTypes.shape({
            home: PropTypes.string.isRequired,
            about_us: PropTypes.string.isRequired,
            explore: PropTypes.string.isRequired,
            resources: PropTypes.string.isRequired,
        }).isRequired,
    },
    ui: PropTypes.shape({
        height_offset: PropTypes.string,
        is_dark_mode_on: PropTypes.bool.isRequired,
        language: PropTypes.string.isRequired,
        components: PropTypes.shape({
            LoginPrompt: any,
            Page404: any,
        }).isRequired,
    }).isRequired,
};

export default connect(({ client, ui }) => ({
    client: {
        is_logged_in: client.is_logged_in,
        loginid: client.loginid,
    },
    config: {
        asset_path: `${websiteUrl()}js/dashboard/assets`,
        has_router: true,
        is_deriv_crypto: false,
        routes: {
            home: routes.dashboard,
            about_us: routes.about_us,
            explore: routes.explore,
            resources: routes.resources,
            platform_dmt5_synthetic: routes.platform_dmt5_synthetic,
        },
    },
    ui: {
        height_offset: '84px',
        is_dark_mode_on: ui.is_dark_mode_on,
        language: getLanguage(),
        components: {
            LoginPrompt,
            Page404,
        },
    },
}))(Dashboard);
