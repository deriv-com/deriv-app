// import PropTypes        from 'prop-types';
import React            from 'react';
import { connect }      from 'Stores/connect';
import DemoMessage      from '../../ErrorMessages/DemoMessage';

class ProofOfAddress extends React.Component {
    render() {
        if (this.props.is_virtual) return <DemoMessage />;
        return (
            <h1>Proof of Address</h1>
        );
    }
}

// ProofOfAddress.propTypes = {};

export default connect(
    ({ client }) => ({
        is_virtual: client.is_virtual,
    }),
)(ProofOfAddress);
