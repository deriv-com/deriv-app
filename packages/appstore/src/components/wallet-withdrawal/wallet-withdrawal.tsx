import React from 'react';
import { useActiveWallet, useCurrencyConfig } from '@deriv/hooks';
import { useStore, observer } from '@deriv/stores';
import WithdrawalVerificationEmail from '@deriv/cashier/src/pages/withdrawal/withdrawal-verification-email';
import CryptoWithdrawal from '@deriv/cashier/src/pages/withdrawal/crypto-withdrawal';
import './wallet-withdrawal.scss';

const WalletWithdrawal = observer(() => {
    const active_wallet = useActiveWallet();
    const { client } = useStore();
    const {
        verification_code: { payment_withdraw: verification_code },
    } = client;

    const { getConfig } = useCurrencyConfig();
    const currency_config = getConfig(active_wallet?.currency || '');
    const is_crypto = currency_config?.is_crypto;

    if (is_crypto && verification_code) {
        return (
            <div className='wallet-withdrawal'>
                <div className='wallet-withdrawal__sidebar' />
                <div className='wallet-withdrawal__content'>
                    <CryptoWithdrawal is_wallet />
                </div>
            </div>
        );
    }

    return <WithdrawalVerificationEmail />;
});

export default WalletWithdrawal;
