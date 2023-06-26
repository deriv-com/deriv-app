import { AutoHeightWrapper } from '@deriv/components';
import ProofOfIdentityContainer from './proof-of-identity-container.jsx';
import React from 'react';
import { changeMetaTagWithOG } from '@deriv/shared';
import { connect } from 'Stores/connect';
import { withRouter } from 'react-router-dom';

const ProofOfIdentity = ({
    account_settings,
    account_status,
    app_routing_history,
    fetchResidenceList,
    getChangeableFields,
    is_from_external,
    is_switching,
    is_virtual,
    is_high_risk,
    is_withdrawal_lock,
    onStateChange,
    refreshNotifications,
    routeBackInApp,
    should_allow_authentication,
    updateAccountStatus,
}) => {
    // next useEffect implements seo requirements
    React.useEffect(() => {
        const description_content = 'Submit your proof of identity documents to verify your account and start trading';
        const title_content = 'Account Verification | Deriv app';

        const restoreMetaTagWithOGDescription = changeMetaTagWithOG('description', description_content);
        const restoreMetaTagWithOGTitle = changeMetaTagWithOG('title', title_content);

        return () => {
            restoreMetaTagWithOGDescription();
            restoreMetaTagWithOGTitle();
        };
    }, []);

    return (
        <AutoHeightWrapper default_height={200}>
            {({ setRef, height }) => (
                <div ref={setRef} className='proof-of-identity'>
                    <div className='proof-of-identity__main-container'>
                        <ProofOfIdentityContainer
                            height={height}
                            account_settings={account_settings}
                            account_status={account_status}
                            app_routing_history={app_routing_history}
                            fetchResidenceList={fetchResidenceList}
                            getChangeableFields={getChangeableFields}
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
                            updateAccountStatus={updateAccountStatus}
                        />
                    </div>
                </div>
            )}
        </AutoHeightWrapper>
    );
};

export default connect(({ client, common, notifications }) => ({
    account_settings: client.account_settings,
    account_status: client.account_status,
    app_routing_history: common.app_routing_history,
    fetchResidenceList: client.fetchResidenceList,
    getChangeableFields: client.getChangeableFields,
    is_switching: client.is_switching,
    is_virtual: client.is_virtual,
    is_high_risk: client.is_high_risk,
    is_withdrawal_lock: client.is_withdrawal_lock,
    refreshNotifications: notifications.refreshNotifications,
    routeBackInApp: common.routeBackInApp,
    should_allow_authentication: client.should_allow_authentication,
    updateAccountStatus: client.updateAccountStatus,
}))(withRouter(ProofOfIdentity));
