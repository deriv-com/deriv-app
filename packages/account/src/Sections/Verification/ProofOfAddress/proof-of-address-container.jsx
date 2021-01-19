import PropTypes from 'prop-types';
import React from 'react';
import { Loading, useStateCallback } from '@deriv/components';
import Expired from 'Components/poa-expired';
import Unverified from 'Components/poa-unverified';
import NeedsReview from 'Components/poa-needs-review';
import Submitted from 'Components/poa-submitted';
import Verified from 'Components/poa-verified';
import NotRequired from 'Components/poa-not-required';
import PoaStatusCodes from 'Components/poa-status-codes';
import { WS } from 'Services/ws-methods';
import ProofOfAddressForm from './proof-of-address-form.jsx';

const ProofOfAddressContainer = ({ is_mx_mlt, refreshNotifications }) => {
    const [is_loading, setIsLoading] = React.useState(true);
    const [authentication_status, setAuthenticationStatus] = useStateCallback({
        allow_resubmission: false,
        needs_poi: false,
        has_poi: false,
        resubmit_poa: false,
        submitted_poa: false,
        document_status: null,
    });

    // componentDidMount hook
    React.useEffect(() => {
        WS.authorized.getAccountStatus().then(response => {
            const { get_account_status } = response;
            const { document, needs_verification } = get_account_status.authentication;
            const needs_poi = needs_verification?.includes('identity');
            const allow_resubmission = needs_verification?.includes('document');
            const submitted_poa = document.status === PoaStatusCodes.pending && !allow_resubmission;
            const document_status = document.status;
            setAuthenticationStatus(
                { ...authentication_status, ...{ allow_resubmission, needs_poi, document_status, submitted_poa } },
                () => {
                    setIsLoading(false);
                    refreshNotifications();
                }
            );
        });
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    const handleResubmit = () => {
        setAuthenticationStatus({ ...authentication_status, ...{ resubmit_poa: true } });
    };

    const onSubmit = ({ needs_poi }) => {
        setAuthenticationStatus({ ...authentication_status, ...{ submitted_poa: true, needs_poi } });
    };

    const { allow_resubmission, document_status, needs_poi, resubmit_poa, submitted_poa } = authentication_status;

    if (is_loading) return <Loading is_fullscreen={false} className='account__initial-loader' />;
    if (!allow_resubmission && status === 'none' && is_mx_mlt) return <NotRequired />;
    if (submitted_poa) return <Submitted needs_poi={needs_poi} />;
    if (resubmit_poa || allow_resubmission) {
        return <ProofOfAddressForm onSubmit={() => onSubmit({ needs_poi })} />;
    }

    switch (document_status) {
        case PoaStatusCodes.none:
            return <ProofOfAddressForm onSubmit={() => onSubmit({ needs_poi })} />;
        case PoaStatusCodes.pending:
            return <NeedsReview />;
        case PoaStatusCodes.verified:
            return <Verified needs_poi={needs_poi} />;
        case PoaStatusCodes.expired:
            return <Expired onClick={handleResubmit} />;
        case PoaStatusCodes.rejected:
            return <Unverified />;
        case PoaStatusCodes.suspected:
            return <Unverified />;
        default:
            return null;
    }
};

ProofOfAddressContainer.propTypes = {
    is_mx_mlt: PropTypes.bool,
    refreshNotifications: PropTypes.func,
};

export default ProofOfAddressContainer;
