import React                    from 'react';
import { connect }              from 'Stores/connect';
import ProofOfIdentityContainer from './proof-of-identity-container.jsx';
import DemoMessage              from '../../ErrorMessages/DemoMessage';

class ProofOfIdentity extends React.Component {
    render() {
        if (this.props.is_virtual) return <DemoMessage />;

        return (
            <ProofOfIdentityContainer />
        );
    }
}

export default connect(
    ({ client }) => ({
        is_virtual: client.is_virtual,
    }),
)(ProofOfIdentity);
