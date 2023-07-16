import React from 'react';
import { useActiveWallet, useCurrencyConfig } from '@deriv/hooks';
import { useStore, observer } from '@deriv/stores';
import WithdrawalVerificationEmail from '@deriv/cashier/src/pages/withdrawal/withdrawal-verification-email';
import CryptoWithdrawForm from '@deriv/cashier/src/pages/withdrawal/crypto-withdraw-form';
import './wallet-withdrawal.scss';

const WalletWithdrawal = observer(() => {
    const active_wallet = useActiveWallet();
    const { client, modules } = useStore();
    const { cashier } = modules;
    const {
        verification_code: { payment_withdraw: verification_code },
    } = client;
    const { is_withdraw_confirmed } = cashier.withdraw;
    const { is_crypto_transactions_visible } = cashier.transaction_history;

    const { getConfig } = useCurrencyConfig();
    const currency_config = getConfig(active_wallet?.currency || '');
    const is_crypto = currency_config?.is_crypto;

    if (verification_code && is_crypto && !is_withdraw_confirmed && !is_crypto_transactions_visible) {
        return <CryptoWithdrawForm />;
    }

    // TODO: Just for test. Move this block to line 23
    return (
        <div className='wallet-withdrawal'>
            <div className='wallet-withdrawal__sidebar' />
            <div className='wallet-withdrawal__content'>
                <CryptoWithdrawForm />
            </div>
        </div>
    );

    return <WithdrawalVerificationEmail />;
});

export default WalletWithdrawal;
