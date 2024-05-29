import React, { useEffect, useState } from 'react';
import { PaymentAgentWithdrawalModule, WithdrawalVerificationModule } from '../../../../lib';

const PaymentAgentWithdrawalContainer = () => {
    const [verificationCode, setVerificationCode] = useState('');

    useEffect(() => {
        const queryParams = new URLSearchParams(location.search);
        const verificationQueryParam = queryParams.get('verification');

        if (verificationQueryParam) {
            setVerificationCode(verificationQueryParam);

            const url = new URL(window.location.href);
            url.searchParams.delete('verification'); // Remove the 'verification_code' query parameter
            window.history.replaceState({}, document.title, url.toString());
        }
    }, []);

    if (verificationCode) {
        return (
            <PaymentAgentWithdrawalModule
                setVerificationCode={setVerificationCode}
                verificationCode={verificationCode}
            />
        );
    }

    return <WithdrawalVerificationModule withdrawalType='paymentagent_withdraw' />;
};

export default PaymentAgentWithdrawalContainer;
