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

            market_commodities: routes.market_commodities,
            market_forex: routes.market_forex,
            market_stock: routes.market_stock,
            market_synthetic: routes.market_synthetic,
            markets: routes.markets,

            platform_binary_bot: routes.platform_binary_bot,
            platform_dbot: routes.platform_dbot,
            platform_dmt5_synthetic: routes.platform_dmt5_synthetic,
            platform_dtrader: routes.platform_dtrader,
            platform_smarttrader: routes.platform_smarttrader,
            platforms: routes.platforms,

            trade_type_cdfs: routes.trade_type_cdfs,
            trade_type_multipliers: routes.trade_type_multipliers,
            trade_type_options: routes.trade_type_options,
            trade_types: routes.trade_types,

            wallet_bank_wire: routes.wallet_bank_wire,
            wallet_cards: routes.wallet_cards,
            wallet_crypto: routes.wallet_crypto,
            wallet_ewallet: routes.wallet_ewallet,
            wallets: routes.wallets,
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
