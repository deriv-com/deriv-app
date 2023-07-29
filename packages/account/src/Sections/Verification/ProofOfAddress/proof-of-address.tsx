import React from 'react';
import { observer, useStore } from '@deriv/stores';
import DemoMessage from '../../../Components/demo-message';
import ProofOfAddressContainer from './proof-of-address-container.jsx';

const ProofOfAddress = observer(() => {
    const { client, notifications, common } = useStore();
    const { app_routing_history } = common;
    const { is_virtual, landing_company_shortcode, has_restricted_mt5_account, is_switching } = client;
    const { refreshNotifications } = notifications;
    if (is_virtual) return <DemoMessage has_button={true} />;

    return (
        <ProofOfAddressContainer
            data-testid='ProofOfAddress'
            is_mx_mlt={landing_company_shortcode === 'iom' || landing_company_shortcode === 'malta'}
            is_switching={is_switching}
            refreshNotifications={refreshNotifications}
            has_restricted_mt5_account={has_restricted_mt5_account}
            app_routing_history={app_routing_history}
        />
    );
});

ProofOfAddress.displayName = 'ProofOfAddress';

export default ProofOfAddress;
