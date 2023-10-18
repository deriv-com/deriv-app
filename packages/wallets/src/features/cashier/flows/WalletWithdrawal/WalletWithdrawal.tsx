import React, { useState } from 'react';
import { useCountdown } from 'usehooks-ts';
import { useSettings, useVerifyEmail } from '@deriv/api';
import { WalletWithdrawalVerification, WalletWithdrawalVerificationSent } from '../../screens';

const WalletWithdrawal = () => {
    const [emailSent, setEmailSent] = useState(false);
    const { data } = useSettings();
    const { mutate } = useVerifyEmail();
    const [count, { resetCountdown, startCountdown }] = useCountdown({
        countStart: 60,
        intervalMs: 1000,
    });

    const handleSendEmail = async () => {
        if (data.email) {
            await mutate({
                type: 'payment_withdraw',
                verify_email: data.email,
            });
            setEmailSent(true);
            resetCountdown();
            startCountdown();
        }
    };

    if (emailSent) return <WalletWithdrawalVerificationSent counter={count} sendEmail={handleSendEmail} />;

    return <WalletWithdrawalVerification sendEmail={handleSendEmail} />;
};

export default WalletWithdrawal;
