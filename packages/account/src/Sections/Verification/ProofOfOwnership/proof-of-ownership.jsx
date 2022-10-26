import React, { useEffect, useState } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'Stores/connect';
import ProofOfOwnershipForm from './proof-of-ownership-form.jsx';
import POOSubmitted from 'Components/poo-submitted';
import { Loading } from '@deriv/components';
import POONotRequired from 'Components/poo-not-required';
import POOVerified from 'Components/poo-verified';
import POORejetced from 'Components/poo-rejected';
import { POO_STATUSES } from './constants/constants';

export const ProofOfOwnership = ({
    account_status,
    client_email,
    is_dark_mode,
    refreshNotifications,
    updateAccountStatus,
}) => {
    const cards = account_status?.authentication?.ownership?.requests;
    const needs_verification = account_status?.authentication?.needs_verification?.includes(POO_STATUSES.ownership);
    const [status, setStatus] = useState(POO_STATUSES.none);
    useEffect(() => {
        setStatus(account_status?.authentication?.ownership?.status?.toLowerCase());
    }, [account_status]);
    const handleRequireSubmission = () => {
        setStatus(POO_STATUSES.none);
    };
    if (needs_verification && status !== POO_STATUSES.rejected) {
        return (
            <ProofOfOwnershipForm
                cards={cards}
                updateAccountStatus={updateAccountStatus}
                refreshNotifications={refreshNotifications}
                is_dark_mode={is_dark_mode}
                client_email={client_email}
            />
        ); // Proof of ownership is required.
    }
    if (status === POO_STATUSES.verified) {
        return <POOVerified />; // Proof of ownership verified
    }
    if (status === POO_STATUSES.pending) {
        return <POOSubmitted />; // Proof of ownership submitted pending review
    }
    if (status === POO_STATUSES.none) {
        return <POONotRequired />; // Client does not need proof of ownership.
    }
    if (status === POO_STATUSES.rejected) {
        return <POORejetced handleRequireSubmission={handleRequireSubmission} />; // Proof of ownership rejected
    }
    return <Loading is_fullscreen={false} className='account__initial-loader' />;
};

export default connect(({ client, notifications, ui }) => ({
    account_status: client.account_status,
    client_email: client.client_email,
    is_dark_mode: ui.is_dark_mode_on,
    refreshNotifications: notifications.refreshNotifications,
    updateAccountStatus: client.updateAccountStatus,
}))(withRouter(ProofOfOwnership));
