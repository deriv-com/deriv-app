// // import PropTypes            from 'prop-types';
import React              from 'react';
import BinarySocket       from '_common/base/socket_base';
import { connect }        from 'Stores/connect';
import ProofOfAddressForm from './proof-of-address-form.jsx';
import {
    Expired,
    NeedsReview,
    Submitted,
    Verified,
    Unverified }          from './proof-of-address-messages.jsx';
import Loading            from '../../../../../templates/app/components/loading.jsx';

const poa_status_codes = {
    none     : 'none',
    pending  : 'pending',
    rejected : 'rejected',
    verified : 'verified',
    expired  : 'expired',
    suspected: 'suspected',
};

class ProofOfAddressContainer extends React.Component {
    state = {
        is_loading   : true,
        needs_poi    : false,
        submitted_poa: false,
        resubmit_poa : false,
    };

    componentDidMount(){
        BinarySocket.wait('authorize', 'get_account_status').then(() => {
            const { document, needs_verification } = this.props.account_status.authentication;
            const needs_poi = !!(needs_verification.length && needs_verification[0] === 'identity');
            this.setState({ status: document.status, needs_poi, is_loading: false });
        });
    }

    handleResubmit = () => {
        this.setState({ resubmit_poa: true });
    }

    onSubmit = ({ needs_poi }) => {
        this.setState({ submitted_poa: true, needs_poi });
    }

    render() {
        const {
            is_loading,
            needs_poi,
            resubmit_poa,
            status,
            submitted_poa,
        } = this.state;

        if (is_loading)    return <Loading is_fullscreen={false} className='account___intial-loader' />;
        if (resubmit_poa)  return <ProofOfAddressForm onSubmit={this.onSubmit} />;
        if (submitted_poa) return <Submitted needs_poi={needs_poi} />;

        switch (status) {
            case poa_status_codes.none:
                return <ProofOfAddressForm onSubmit={this.onSubmit} />;
            case poa_status_codes.pending:
                return <NeedsReview />;
            case poa_status_codes.verified:
                return <Verified needs_poi={needs_poi} />;
            case poa_status_codes.expired:
                return <Expired onClick={this.handleResubmit} />;
            case poa_status_codes.rejected:
                return <Unverified />;
            case poa_status_codes.suspected:
                return <Unverified />;
            default:
                return null;
        }
    }
}

export default connect(
    ({ client }) => ({
        account_status: client.account_status,
    }),
)(ProofOfAddressContainer);
