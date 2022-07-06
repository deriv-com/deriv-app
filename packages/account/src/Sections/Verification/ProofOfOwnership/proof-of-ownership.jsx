import React, { useEffect, useState } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'Stores/connect';
import ProofOfOwnershipForm from './proof-of-ownership-form.jsx';
import POOSubmitted from 'Components/poo-submitted';
import { Loading } from '@deriv/components';
import POONotRequired from 'Components/poo-not-required';
import POOVerified from 'Components/poo-verified';
import POORejetced from 'Components/poo-rejected';
import { VERIFIED, PENDING, NONE, REJECTED, OWNERSHIP } from './constants/constants';

export const ProofOfOwnership = ({ account_status, updateAccountStatus }) => {
    const cards = account_status?.authentication?.ownership?.requests;
    const needs_verification = account_status?.authentication?.needs_verification?.includes(OWNERSHIP);
    const [status, setStatus] = useState(NONE);
    useEffect(() => {
        setStatus(account_status?.authentication?.ownership?.status);
    }, [account_status]);
    const handleRequireSubmission = () => {
        setStatus(NONE);
    };
    if (needs_verification && status !== REJECTED) {
        return <ProofOfOwnershipForm cards={cards} updateAccountStatus={updateAccountStatus} />; // Proof of ownership is required.
    }
    if (status === VERIFIED) {
        return <POOVerified />; // Proof of ownership verified
    }
    if (status === PENDING) {
        return <POOSubmitted />; // Proof of ownership submitted pending review
    }
    if (status === NONE) {
        return <POONotRequired />; // Client does not need proof of ownership.
    }
    if (status === REJECTED) {
        return <POORejetced handleRequireSubmission={handleRequireSubmission} />; // Proof of ownership rejected
    }
    return <Loading is_fullscreen={false} className='account__initial-loader' />;
};

export default connect(({ client }) => ({
    account_status: client.account_status,
    updateAccountStatus: client.updateAccountStatus,
}))(withRouter(ProofOfOwnership));
