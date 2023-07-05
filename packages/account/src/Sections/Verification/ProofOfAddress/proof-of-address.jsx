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
    ...props
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
            {...props}
        />
    );
};

ProofOfAddress.propTypes = {
    is_mx_mlt: PropTypes.bool,
    is_switching: PropTypes.bool,
    is_virtual: PropTypes.bool,
    refreshNotifications: PropTypes.func,
    has_restricted_mt5_account: PropTypes.bool,
    app_routing_history: PropTypes.array,
    account_settings: PropTypes.object,
    addNotificationByKey: PropTypes.func,
    removeNotificationMessage: PropTypes.func,
    removeNotificationByKey: PropTypes.func,
    is_eu: PropTypes.bool,
    fetchResidenceList: PropTypes.func,
    fetchStatesList: PropTypes.func,
    states_list: PropTypes.array,
};

export default connect(({ client, notifications, common }) => ({
    is_mx_mlt: client.landing_company_shortcode === 'iom' || client.landing_company_shortcode === 'malta',
    is_switching: client.is_switching,
    is_virtual: client.is_virtual,
    refreshNotifications: notifications.refreshNotifications,
    has_restricted_mt5_account: client.has_restricted_mt5_account,
    app_routing_history: common.app_routing_history,
    account_settings: client.account_settings,
    is_eu: client.is_eu,
    addNotificationByKey: notifications.addNotificationMessageByKey,
    removeNotificationMessage: notifications.removeNotificationMessage,
    removeNotificationByKey: notifications.removeNotificationByKey,
    states_list: client.states_list,
    fetchResidenceList: client.fetchResidenceList,
    fetchStatesList: client.fetchStatesList,
}))(ProofOfAddress);
