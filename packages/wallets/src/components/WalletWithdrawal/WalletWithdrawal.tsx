import React, { useState } from 'react';
import { useSettings, useVerifyEmail } from '@deriv/api';
import useCountdown from '../../hooks/useCountdown';
import { WalletWithdrawalVerification } from '../WalletWithdrawalVerification';
import { WalletWithdrawalVerificationSent } from '../WalletWithdrawalVerificationSent';

const WalletWithdrawal = () => {
    const [emailSent, setEmailSent] = useState(false);
    const { data } = useSettings();
    const { mutate } = useVerifyEmail();
    const counter = useCountdown({ from: 60 });

    const handleSendEmail = async () => {
        if (data.email) {
            await mutate({
                type: 'payment_withdraw',
                verify_email: data.email,
            });
            setEmailSent(true);
            counter.reset();
            counter.start();
        }
    };

    if (emailSent) return <WalletWithdrawalVerificationSent counter={counter} sendEmail={handleSendEmail} />;

    return <WalletWithdrawalVerification sendEmail={handleSendEmail} />;
};

export default WalletWithdrawal;
