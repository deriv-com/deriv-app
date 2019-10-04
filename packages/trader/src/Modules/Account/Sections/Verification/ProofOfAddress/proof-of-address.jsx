import React                   from 'react';
import { connect }             from 'Stores/connect';
import ProofOfAddressContainer from './proof-of-address-container.jsx';
import DemoMessage             from '../../ErrorMessages/DemoMessage';

class ProofOfAddress extends React.Component {
    render() {
        if (this.props.is_virtual) return <DemoMessage />;

        return (
            <ProofOfAddressContainer refreshNotifications={this.props.refreshNotifications} />
        );
    }
}

export default connect(
    ({ client }) => ({
        is_virtual          : client.is_virtual,
        refreshNotifications: client.refreshNotifications,
    }),
)(ProofOfAddress);
