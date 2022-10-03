import React from 'react';
import { withRouter } from 'react-router-dom';
import { AutoHeightWrapper } from '@deriv/components';
import { connect } from 'Stores/connect';
import ProofOfIdentityContainer from './proof-of-identity-container.jsx';

const ProofOfIdentity = ({
    account_status,
    app_routing_history,
    fetchResidenceList,
    is_from_external,
    is_switching,
    is_virtual,
    is_high_risk,
    is_withdrawal_lock,
    onStateChange,
    refreshNotifications,
    routeBackInApp,
    should_allow_authentication,
}) => {
    return (
        <AutoHeightWrapper default_height={200}>
            {({ setRef, height }) => (
                <div ref={setRef} className='proof-of-identity'>
                    <div className='proof-of-identity__main-container'>
                        <ProofOfIdentityContainer
                            height={height}
                            account_status={account_status}
                            app_routing_history={app_routing_history}
                            fetchResidenceList={fetchResidenceList}
                            is_from_external={is_from_external}
                            is_switching={is_switching}
                            is_virtual={is_virtual}
                            is_high_risk={is_high_risk}
                            is_withdrawal_lock={is_withdrawal_lock}
                            onStateChange={onStateChange}
                            refreshNotifications={refreshNotifications}
                            routeBackInApp={routeBackInApp}
                            should_allow_authentication={should_allow_authentication}
                            is_description_enabled
                        />
                    </div>
                </div>
            )}
        </AutoHeightWrapper>
    );
};

export default connect(({ client, common, notifications }) => ({
    account_status: client.account_status,
    app_routing_history: common.app_routing_history,
    fetchResidenceList: client.fetchResidenceList,
    is_switching: client.is_switching,
    is_virtual: client.is_virtual,
    is_high_risk: client.is_high_risk,
    is_withdrawal_lock: client.is_withdrawal_lock,
    refreshNotifications: notifications.refreshNotifications,
    routeBackInApp: common.routeBackInApp,
    should_allow_authentication: client.should_allow_authentication,
}))(withRouter(ProofOfIdentity));
