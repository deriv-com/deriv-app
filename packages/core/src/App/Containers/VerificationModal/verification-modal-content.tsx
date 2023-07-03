import React from 'react';
import { ProofOfIdentityContainer } from '@deriv/account';
import { AutoHeightWrapper } from '@deriv/components';
import { observer, useStore } from '@deriv/stores';

type TVerificationModal = {
    is_from_external?: boolean;
    onStateChange?: () => void;
};

const VerificationModalContent = observer(({ is_from_external, onStateChange }: TVerificationModal) => {
    const { client, common, notifications, ui } = useStore();
    const {
        account_status,
        account_settings,
        fetchResidenceList,
        getChangeableFields,
        is_switching,
        is_high_risk,
        is_withdrawal_lock,
        should_allow_authentication,
        is_virtual,
        updateAccountStatus,
    } = client;
    const { refreshNotifications } = notifications;
    const { app_routing_history, routeBackInApp } = common;

    return (
        <AutoHeightWrapper default_height={200}>
            {({ setRef }) => (
                <div ref={setRef} className='proof-of-identity'>
                    <div className='proof-of-identity__main-container'>
                        <ProofOfIdentityContainer
                            height='620px'
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
});

export default VerificationModalContent;
