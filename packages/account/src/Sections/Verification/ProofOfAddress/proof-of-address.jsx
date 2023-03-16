import React from 'react';
import { PlatformContext } from '@deriv/shared';
import { observer, useStore } from '@deriv/stores';
import DemoMessage from 'Components/demo-message';
import ProofOfAddressContainer from './proof-of-address-container.jsx';

const ProofOfAddress = observer(() => {
    const { client, notifications } = useStore();
    const { is_appstore } = React.useContext(PlatformContext);
    if (client.is_virtual) return <DemoMessage has_demo_icon={is_appstore} has_button={true} />;

    return (
        <ProofOfAddressContainer
            is_mx_mlt={client.landing_company_shortcode === 'iom' || client.landing_company_shortcode === 'malta'}
            is_switching={client.is_switching}
            refreshNotifications={notifications.refreshNotifications}
            has_restricted_mt5_account={client.has_restricted_mt5_account}
        />
    );
});

export default ProofOfAddress;
