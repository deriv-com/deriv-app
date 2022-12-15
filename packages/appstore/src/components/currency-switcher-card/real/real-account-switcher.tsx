import React from 'react';
import { useStores } from 'Stores/index';

const AccountNeedsVerification = () => {
    return <div>Account Needs Verification</div>;
};

const AccountPendingVerification = () => {
    return <div>Account Pending Verification</div>;
};

const AccountVerificationFailed = () => {
    return <div>Account Failed Verification</div>;
};

const RealAccountCard = () => {
    return <div>Real Money</div>;
};

const RealAccountSwitcher = () => {
    const { client } = useStores();

    if (client.is_authentication_needed) {
        return <AccountNeedsVerification />;
    }

    if (
        client.account_status?.authentication?.document.status === 'pending' ||
        client.account_status?.authentication?.identity.status === 'pending'
    ) {
        return <AccountPendingVerification />;
    }

    if (
        client.account_status?.authentication?.document.status === 'rejected' ||
        client.account_status?.authentication?.identity.status === 'rejected'
    ) {
        return <AccountVerificationFailed />;
    }

    return <RealAccountCard />;
};

export default RealAccountSwitcher;
