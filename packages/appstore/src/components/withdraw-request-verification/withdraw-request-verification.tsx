import React from 'react';
import WithdrawalVerificationEmail from '@deriv/cashier/src/pages/withdrawal/withdrawal-verification-email';

const WithdrawRequestVerification = () => {
    return (
        <WithdrawalVerificationEmail
            request_email_icon='IcWithdrawRequestVerification'
            sent_email_icon='IcWithdrawRequestVerificationSent'
        />
    );
};

export default WithdrawRequestVerification;
