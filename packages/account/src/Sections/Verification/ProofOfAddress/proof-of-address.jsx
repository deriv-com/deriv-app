import React from 'react';
import { useHistory } from 'react-router-dom';
import { getPlatformRedirect } from '@deriv/shared';
import { connect } from 'Stores/connect';
import DemoMessage from 'Components/demo-message';
import { WS } from 'Services/ws-methods';
import ProofOfAddressContainer from './proof-of-address-container.jsx';

const ProofOfAddress = ({
    is_virtual,
    is_mx_mlt,
    refreshNotifications,
    should_allow_authentication,
    app_routing_history,
    routeBackInApp,
}) => {
    const history = useHistory();
    React.useEffect(() => {
        WS.wait('get_account_status').then(() => {
            if (!should_allow_authentication) {
                const from_platform = getPlatformRedirect(app_routing_history);
                routeBackInApp(history, [from_platform]);
            }
        });
    }, []);

    if (is_virtual) return <DemoMessage />;

    return <ProofOfAddressContainer is_mx_mlt={is_mx_mlt} refreshNotifications={refreshNotifications} />;
};

export default connect(({ client, common }) => ({
    app_routing_history: common.app_routing_history,
    is_mx_mlt: client.landing_company_shortcode === 'iom' || client.landing_company_shortcode === 'malta',
    is_virtual: client.is_virtual,
    refreshNotifications: client.refreshNotifications,
    routeBackInApp: common.routeBackInApp,
    should_allow_authentication: client.should_allow_authentication,
}))(ProofOfAddress);
