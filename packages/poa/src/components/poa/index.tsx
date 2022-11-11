import React, { useEffect } from 'react';
import { Text, Loading, Icon, EmptyState } from '@deriv/components';
import { localize } from '@deriv/translations';
import { useWS } from '@deriv/api';
import { useDocumentStatus } from '@deriv/hooks';

const ProofOfAddress = ({ is_mx_mlt = false, has_restricted_mt5_account = false }) => {
    const { is_loading, data, send } = useWS('get_account_status');
    const document = useDocumentStatus(data?.authentication?.document);
    const allow_document_upload = data?.status.some(status => status === 'allow_document_upload');
    const allow_poa_resubmission = data?.status.some(status => status === 'allow_poa_resubmission');
    const is_age_verified = data?.status.some(status => status === 'age_verification');
    const has_submitted_poa = document.is_pending && !allow_poa_resubmission;
    const is_not_required = !is_age_verified && !allow_poa_resubmission && document.is_none && is_mx_mlt;
    const is_need_poa = ['expired', 'rejected', 'suspected'].some(status => status === document.status);
    const can_submit_poa = allow_poa_resubmission || (has_restricted_mt5_account && is_need_poa);
    const can_resubmit_poa = false;

    useEffect(() => {
        send();
    }, []);

    if (is_loading) return <Loading is_fullscreen={false} className='account__initial-loader' />;
    if (!allow_document_upload || is_not_required)
        return (
            <EmptyState
                icon={'IcPoaVerified'}
                title={localize('Proof of address verification not required')}
                description={localize(
                    'Your account does not need address verification at this time. We will inform you if address verification is required in the future.'
                )}
            />
        );
    if (has_submitted_poa) return <Text>Submitted</Text>;
    if (can_submit_poa || can_resubmit_poa) return <Text>ProofOfAddressForm</Text>;
    if (document.is_none) return <Text>none</Text>;
    if (document.is_pending) return <Text>pending</Text>;
    if (document.is_verified) return <Text>verified</Text>;
    if (document.is_expired) return <Text>expired</Text>;
    if (document.is_rejected) return <Text>rejected</Text>;
    if (document.is_suspected) return <Text>suspected</Text>;

    return null;
};

export default ProofOfAddress;
