import React from 'react';
import { WithdrawalFiatModule, WithdrawalVerificationModule } from '../../modules';

const WalletWithdrawal = () => {
    //TODO: add withdrawal crypto module

    if (sessionStorage.getItem('verification_code')) return <WithdrawalFiatModule />;

    return <WithdrawalVerificationModule />;
};

export default WalletWithdrawal;
