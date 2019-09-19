// import PropTypes        from 'prop-types';
import React               from 'react';
import { connect }         from 'Stores/connect';
import ProofOfIdentityForm from './proof-of-identity-form.jsx';
import DemoMessage         from '../../ErrorMessages/DemoMessage';


class ProofOfIdentity extends React.Component {
    render() {
        if (this.props.is_virtual) return <DemoMessage />;
        return (
            <ProofOfIdentityForm />
        );
    }
}

// ProofOfIdentity.propTypes = {};
export default connect(
    ({ client }) => ({
        is_virtual: client.is_virtual,
    }),
)(ProofOfIdentity);
