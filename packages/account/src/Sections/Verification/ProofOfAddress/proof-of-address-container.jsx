// // import PropTypes            from 'prop-types';
import React from 'react';
import { Loading } from '@deriv/components';
import Expired from 'Components/poa-expired';
import Unverified from 'Components/poa-unverified';
import NeedsReview from 'Components/poa-needs-review';
import Submitted from 'Components/poa-submitted';
import Verified from 'Components/poa-verified';
import PoaStatusCodes from 'Components/poa-status-codes';
import { WS } from 'Services/ws-methods';
import ProofOfAddressForm from './proof-of-address-form.jsx';

class ProofOfAddressContainer extends React.Component {
    is_mounted = false;
    state = {
        is_loading: true,
        has_poi: false,
        submitted_poa: false,
        resubmit_poa: false,
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
                    status: document.status,
                    needs_poi,
                    is_loading: false,
                    submitted_poa: document.status === PoaStatusCodes.pending,
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
    };

    onSubmit = ({ needs_poi }) => {
        this.setState({ submitted_poa: true, needs_poi });
    };

    render() {
        const { is_loading, needs_poi, resubmit_poa, status, submitted_poa } = this.state;

        if (is_loading) return <Loading is_fullscreen={false} className='account___intial-loader' />;
        if (submitted_poa) return <Submitted needs_poi={needs_poi} />;
        if (resubmit_poa) return <ProofOfAddressForm onSubmit={() => this.onSubmit({ needs_poi })} />;

        switch (status) {
            case PoaStatusCodes.none:
                return <ProofOfAddressForm onSubmit={() => this.onSubmit({ needs_poi })} />;
            case PoaStatusCodes.pending:
                return <NeedsReview />;
            case PoaStatusCodes.verified:
                return <Verified needs_poi={needs_poi} />;
            case PoaStatusCodes.expired:
                return <Expired onClick={this.handleResubmit} />;
            case PoaStatusCodes.rejected:
                return <Unverified />;
            case PoaStatusCodes.suspected:
                return <Unverified />;
            default:
                return null;
        }
    }
}

export default ProofOfAddressContainer;
