import React from 'react';
import { PropTypes } from 'prop-types';
import { connect } from 'Stores/connect';
import DemoMessage from 'Components/demo-message';
import ProofOfAddressContainer from './proof-of-address-container.jsx';

const ProofOfAddress = ({ is_virtual, is_mx_mlt, refreshNotifications, is_dashboard }) => {
    if (is_virtual) return <DemoMessage is_dashboard={is_dashboard} />;

    return (
        <ProofOfAddressContainer
            is_dashboard={is_dashboard}
            is_mx_mlt={is_mx_mlt}
            refreshNotifications={refreshNotifications}
        />
    );
};

ProofOfAddress.propTypes = {
    is_dashboard: PropTypes.bool,
    is_mx_mlt: PropTypes.bool,
    is_virtual: PropTypes.bool,
    refreshNotifications: PropTypes.func,
};

export default connect(({ client }) => ({
    is_mx_mlt: client.landing_company_shortcode === 'iom' || client.landing_company_shortcode === 'malta',
    is_virtual: client.is_virtual,
    refreshNotifications: client.refreshNotifications,
}))(ProofOfAddress);
