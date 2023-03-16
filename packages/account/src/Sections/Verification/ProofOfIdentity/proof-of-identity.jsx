import React from 'react';
import { withRouter } from 'react-router-dom';
import { AutoHeightWrapper } from '@deriv/components';
import { changeMetaTagWithOG } from '@deriv/shared';
import { observer, useStore } from '@deriv/stores';
import ProofOfIdentityContainer from './proof-of-identity-container.jsx';

const ProofOfIdentity = observer(({ is_from_external, onStateChange }) => {
    const { client, common, notifications } = useStore();
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
                            account_status={client.account_status}
                            app_routing_history={common.app_routing_history}
                            fetchResidenceList={client.fetchResidenceList}
                            is_from_external={is_from_external}
                            is_switching={client.is_switching}
                            is_virtual={client.is_virtual}
                            is_high_risk={client.is_high_risk}
                            is_withdrawal_lock={client.is_withdrawal_lock}
                            onStateChange={onStateChange}
                            refreshNotifications={notifications.refreshNotifications}
                            routeBackInApp={common.routeBackInApp}
                            should_allow_authentication={client.should_allow_authentication}
                            is_description_enabled
                        />
                    </div>
                </div>
            )}
        </AutoHeightWrapper>
    );
});

export default withRouter(ProofOfIdentity);
