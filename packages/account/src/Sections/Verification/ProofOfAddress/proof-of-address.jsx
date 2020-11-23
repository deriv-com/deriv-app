import React from 'react';
import { connect } from 'Stores/connect';
import DemoMessage from 'Components/demo-message';
import ProofOfAddressContainer from './proof-of-address-container.jsx';

class ProofOfAddress extends React.Component {
    render() {
        if (this.props.is_virtual) return <DemoMessage />;

        return (
            <ProofOfAddressContainer
                is_mx_mlt={this.props.is_mx_mlt}
                refreshNotifications={this.props.refreshNotifications}
            />
        );
    }
}

export default connect(({ client }) => ({
    is_mx_mlt: client.landing_company_shortcode === 'iom' || client.landing_company_shortcode === 'malta',
    is_virtual: client.is_virtual,
    refreshNotifications: client.refreshNotifications,
}))(ProofOfAddress);
