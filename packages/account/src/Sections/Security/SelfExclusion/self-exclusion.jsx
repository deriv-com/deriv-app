import SelfExclusionComponent from 'Components/self-exclusion/self-exclusion.jsx';
import { WS } from 'Services/ws-methods';
import { connect } from 'Stores/connect';

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
    is_wrapper_bypassed: false,
    logout: client.logout,
    ws: WS,
}))(SelfExclusionComponent);
