import React from 'react';
import { PlatformContext, WS } from '@deriv/shared';
import { connect } from 'Stores/connect';
import SelfExclusionComponent from 'Components/self-exclusion/self-exclusion';
import 'Components/self-exclusion/self-exclusion.scss';

const SelfExclusion = props => {
    const { is_appstore } = React.useContext(PlatformContext);
    return <SelfExclusionComponent is_appstore={is_appstore} {...props} />;
};

export default connect(({ client, ui }) => ({
    is_tablet: ui.is_tablet,
    currency: client.currency,
    is_virtual: client.is_virtual,
    is_switching: client.is_switching,
    is_cr: client.standpoint.svg,
    is_eu: client.is_eu,
    is_mlt: client.landing_company_shortcode === 'malta',
    is_mf: client.landing_company_shortcode === 'maltainvest',
    is_mx: client.landing_company_shortcode === 'iom',
    is_uk: client.is_uk,
    is_wrapper_bypassed: false,
    logout: client.logout,
    ws: WS,
}))(SelfExclusion);
