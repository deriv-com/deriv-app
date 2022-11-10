import React, { useEffect } from 'react';
import { Text, Loading } from '@deriv/components';
import { useWS } from '@deriv/api';

const ProofOfAddress = ({ is_mx_mlt = false, has_restricted_mt5_account = false }) => {
    const { is_loading, data, send } = useWS('get_account_status');
    const allow_document_upload = data?.status.some(status => status === 'allow_document_upload');
    const allow_poa_resubmission = data?.status.some(status => status === 'allow_poa_resubmission');
    const is_age_verified = data?.status.some(status => status === 'age_verification');
    const document_status = data?.authentication?.document?.status;
    const is_document_status_none = document_status === 'none';
    const is_document_status_pending = document_status === 'pending';
    const is_document_status_verified = document_status === 'verified';
    const is_document_status_expired = document_status === 'expired';
    const is_document_status_rejected = document_status === 'rejected';
    const is_document_status_suspected = document_status === 'suspected';
    const has_submitted_poa = is_document_status_pending && !allow_poa_resubmission;
    const is_not_required = !is_age_verified && !allow_poa_resubmission && is_document_status_none && is_mx_mlt;
    const is_need_poa = ['expired', 'rejected', 'suspected'].some(status => status === document_status);
    const can_submit_poa = allow_poa_resubmission || (has_restricted_mt5_account && is_need_poa);
    const can_resubmit_poa = false;

    useEffect(() => {
        send();
    }, []);

    if (is_loading) return <Loading is_fullscreen={false} className='account__initial-loader' />;
    if (!allow_document_upload || is_not_required) return <Text>NotRequired</Text>;
    if (has_submitted_poa) return <Text>Submitted</Text>;
    if (can_submit_poa || can_resubmit_poa) return <Text>ProofOfAddressForm</Text>;
    if (is_document_status_none) return <Text>none</Text>;
    if (is_document_status_pending) return <Text>pending</Text>;
    if (is_document_status_verified) return <Text>verified</Text>;
    if (is_document_status_expired) return <Text>expired</Text>;
    if (is_document_status_rejected) return <Text>rejected</Text>;
    if (is_document_status_suspected) return <Text>suspected</Text>;

    return null;
};

export default ProofOfAddress;
