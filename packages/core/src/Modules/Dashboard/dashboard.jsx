import React from 'react';
import PropTypes, { any } from 'prop-types';
import DashboardComponent from '@deriv/dashboard';
import { routes, websiteUrl } from '@deriv/shared';
import { getLanguage } from '@deriv/translations';
import { WS } from 'Services';
import { connect } from 'Stores/connect';
import ServerTime from '_common/base/server_time';
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
            Page404: any,
        }).isRequired,
    }).isRequired,
};

export default connect(({ client, ui }) => ({
    client: {
        is_logged_in: client.is_logged_in,
        loginid: client.loginid,
        email_address: client.email_address,
        currencies_list: client.currencies_list,
        currency: client.currency,
        has_active_real_account: client.has_active_real_account,
        upgradeable_currencies: client.upgradeable_currencies,
        upgradeable_landing_companies: client.upgradeable_landing_companies,
        fetchResidenceList: client.fetchResidenceList,
        fetchStatesList: client.fetchStatesList,
        fetchFinancialAssessment: client.fetchFinancialAssessment,
        needs_financial_assessment: client.needs_financial_assessment,
        residence_list: client.residence_list,
        states_list: client.states_list,
        financial_assessment: client.financial_assessment,
        account_settings: client.account_settings,
        accounts_list: client.accounts_list,
    },
    config: {
        asset_path: `${websiteUrl()}js/dashboard/assets`,
        has_router: true,
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
            Page404,
        },
        real_account_signup: ui.real_account_signup,
        real_account_signup_target: ui.real_account_signup_target,
        resetRealAccountSignupParams: ui.resetRealAccountSignupParams,
        openRealAccountSignup: ui.openRealAccountSignup,
    },
}))(Dashboard);
