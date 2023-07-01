import DemoMessage from 'Components/demo-message';
import { PlatformContext } from '@deriv/shared';
import ProofOfAddressContainer from './proof-of-address-container.jsx';
import { PropTypes } from 'prop-types';
import React from 'react';
import { connect } from 'Stores/connect';

const ProofOfAddress = ({
    is_virtual,
    is_mx_mlt,
    is_switching,
    has_restricted_mt5_account,
    refreshNotifications,
    app_routing_history,
}) => {
    const { is_appstore } = React.useContext(PlatformContext);
    if (is_virtual) return <DemoMessage has_demo_icon={is_appstore} has_button={true} />;

    return (
        <ProofOfAddressContainer
            is_mx_mlt={is_mx_mlt}
            is_switching={is_switching}
            refreshNotifications={refreshNotifications}
            has_restricted_mt5_account={has_restricted_mt5_account}
            app_routing_history={app_routing_history}
        />
    );
};

ProofOfAddress.propTypes = {
    is_mx_mlt: PropTypes.bool,
    is_switching: PropTypes.bool,
    is_virtual: PropTypes.bool,
    refreshNotifications: PropTypes.func,
    has_restricted_mt5_account: PropTypes.bool,
};

export default connect(({ client, notifications, common }) => ({
    is_mx_mlt: client.landing_company_shortcode === 'iom' || client.landing_company_shortcode === 'malta',
    is_switching: client.is_switching,
    is_virtual: client.is_virtual,
    refreshNotifications: notifications.refreshNotifications,
    has_restricted_mt5_account: client.has_restricted_mt5_account,
    app_routing_history: common.app_routing_history,
}))(ProofOfAddress);
