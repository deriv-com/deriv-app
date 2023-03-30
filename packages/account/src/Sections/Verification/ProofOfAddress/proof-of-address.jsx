import React from 'react';
import { PlatformContext } from '@deriv/shared';
import { observer, useStore } from '@deriv/stores';
import DemoMessage from 'Components/demo-message';
import ProofOfAddressContainer from './proof-of-address-container.jsx';

const ProofOfAddress = observer(() => {
    const { client, notifications } = useStore();
    const { is_virtual, landing_company_shortcode, has_restricted_mt5_account, is_switching } = client;
    const { refreshNotifications } = notifications;
    const { is_appstore } = React.useContext(PlatformContext);
    if (is_virtual) return <DemoMessage has_demo_icon={is_appstore} has_button={true} />;

    return (
        <ProofOfAddressContainer
            is_mx_mlt={landing_company_shortcode === 'iom' || landing_company_shortcode === 'malta'}
            is_switching={is_switching}
            refreshNotifications={refreshNotifications}
            has_restricted_mt5_account={has_restricted_mt5_account}
        />
    );
});

export default ProofOfAddress;
