// // import PropTypes            from 'prop-types';
import React                   from 'react';
import BinarySocket            from '_common/base/socket_base';
import { connect }             from 'Stores/connect';
import ProofOfAddressForm      from './proof-of-address-form.jsx';
import DemoMessage             from '../../ErrorMessages/DemoMessage';
import DocumentNeedsReview     from '../VerificationMessages/DocumentNeedsReview';
import DocumentsSubmitted      from '../VerificationMessages/DocumentsSubmitted';
import DocumentsExpired        from '../VerificationMessages/DocumentsExpired';
import DocumentsVerified       from '../VerificationMessages/DocumentsVerified';
import { Unverified }          from '../ProofOfIdentity/proof-of-identity-messages.jsx';

const poa_status_codes = {
    none     : 'none',
    submitted: 'pending',
    pending  : 'pending',
    rejected : 'rejected',
    verified : 'verified',
    expired  : 'expired',
    suspected: 'suspected',
};

class ProofOfAddress extends React.Component {
    componentDidMount(){
        BinarySocket.wait('authorize', 'get_account_status').then(() => {
            const { document } = this.props.account_status.authentication;
            // console.log(identity, document);
            // const needs_poi = getIdentityStatus(identity, onfido_unsupported);
            this.setState({ status: document, needs_poi: true });
        });
    }

    render() {
        if (this.props.is_virtual) return <DemoMessage />;

        const { status, needs_poi } = this.props;

        switch (status) {
            case poa_status_codes.none:
                return <ProofOfAddressForm />;
            case poa_status_codes.submitted:
                return <DocumentsSubmitted />;
            case poa_status_codes.pending:
                return <DocumentNeedsReview />;
            case poa_status_codes.rejected:
                return <Unverified />;
            case poa_status_codes.verified:
                return <DocumentsVerified needs_poi={needs_poi} />;
            case poa_status_codes.expired:
                return <DocumentsExpired onClick={this.handleResubmit} />;
            case poa_status_codes.suspected:
                return <Unverified />;
            default:
                return <ProofOfAddressForm />;
        }
    }
}

export default connect(
    ({ client }) => ({
        account_status: client.account_status,
        is_virtual    : client.is_virtual,
    }),
)(ProofOfAddress);
