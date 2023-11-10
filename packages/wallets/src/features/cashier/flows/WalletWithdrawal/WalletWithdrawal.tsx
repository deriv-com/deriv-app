import React from 'react';
import { WithdrawalFiatModule, WithdrawalVerificationModule } from '../../modules';

const WalletWithdrawal = () => {
    const queryParams = new URLSearchParams(location.search);
    const verificationCode = queryParams.get('verification');

    if (verificationCode) return <WithdrawalFiatModule />;

    return <WithdrawalVerificationModule />;
};

export default WalletWithdrawal;
