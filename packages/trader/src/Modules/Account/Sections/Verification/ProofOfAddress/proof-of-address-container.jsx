// // import PropTypes            from 'prop-types';
import React              from 'react';
import { WS }             from 'Services/ws-methods';
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
    is_mounted = false;
    state = {
        is_loading   : true,
        has_poi      : false,
        submitted_poa: false,
        resubmit_poa : false,
    };

    componentDidMount() {
        // TODO: Find a better solution for handling no-op instead of using is_mounted flags
        this.is_mounted = true;
        WS.authorized.getAccountStatus().then(response => {
            const { get_account_status } = response;
            const { document, needs_verification } = get_account_status.authentication;
            const needs_poi = needs_verification.length && needs_verification.includes('identity');
            if (this.is_mounted) {
                this.setState({
                    status       : document.status, needs_poi,
                    is_loading   : false,
                    submitted_poa: !(needs_verification.length && needs_verification.includes('document')),
                });
                this.props.refreshNotifications();
            }
        });
    }

    componentWillUnmount() {
        this.is_mounted = false;
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
        if (submitted_poa) return <Submitted needs_poi={needs_poi} />;
        if (resubmit_poa)  return <ProofOfAddressForm onSubmit={() => this.onSubmit({ needs_poi })} />;

        switch (status) {
            case poa_status_codes.none:
                return <ProofOfAddressForm onSubmit={() => this.onSubmit({ needs_poi })} />;
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

export default ProofOfAddressContainer;
