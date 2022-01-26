import React from 'react';
import { PlatformContext } from '@deriv/shared';
import { connect } from 'Stores/connect';
import DemoMessage from 'Components/demo-message';
import ProofOfAddressContainer from './proof-of-address-container.jsx';

type ProofOfAddressProps = {
    is_mx_mlt: boolean;
    is_switching: boolean;
    is_virtual: boolean;
    refreshNotifications: () => void;
};

const ProofOfAddress = ({ is_virtual, is_mx_mlt, is_switching, refreshNotifications }: ProofOfAddressProps) => {
    const { is_dashboard } = React.useContext(PlatformContext);
    if (is_virtual) return <DemoMessage has_demo_icon={is_dashboard} has_button={true} />;

    return (
        <ProofOfAddressContainer
            is_mx_mlt={is_mx_mlt}
            is_switching={is_switching}
            refreshNotifications={refreshNotifications}
        />
    );
};

export default connect(({ client }) => ({
    is_mx_mlt: client.landing_company_shortcode === 'iom' || client.landing_company_shortcode === 'malta',
    is_switching: client.is_switching,
    is_virtual: client.is_virtual,
    refreshNotifications: client.refreshNotifications,
}))(ProofOfAddress);
