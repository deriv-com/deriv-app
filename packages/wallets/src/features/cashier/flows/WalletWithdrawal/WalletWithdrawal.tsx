import React, { useState } from 'react';
import { WithdrawalFiatModule, WithdrawalVerificationModule } from '../../modules';

const WalletWithdrawal = () => {
    const queryParams = new URLSearchParams(location.search);
    const verificationQueryParam = queryParams.get('verification');

    const [verificationCode, setVerificationCode] = useState('');

    if (verificationQueryParam) {
        setVerificationCode(verificationQueryParam);

        const url = new URL(window.location.href);
        url.searchParams.delete('verification'); // Remove the 'verification_code' query parameter
        window.history.replaceState({}, document.title, url.toString());
    }

    if (verificationCode) {
        return <WithdrawalFiatModule verificationCode={verificationCode} />;
    }

    return <WithdrawalVerificationModule />;
};

export default WalletWithdrawal;
