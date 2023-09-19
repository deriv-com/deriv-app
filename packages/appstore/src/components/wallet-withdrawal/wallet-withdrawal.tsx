import React from 'react';
import { useCurrencyConfig } from '@deriv/api';
import { useActiveWallet } from '@deriv/hooks';
import { useStore, observer } from '@deriv/stores';
import { Div100vhContainer } from '@deriv/components';
import WithdrawalVerificationEmail from '@deriv/cashier/src/pages/withdrawal/withdrawal-verification-email';
import CryptoWithdrawal from '@deriv/cashier/src/pages/withdrawal/crypto-withdrawal';
import Withdraw from '@deriv/cashier/src/pages/withdrawal/withdraw';
import './wallet-withdrawal.scss';

const WalletWithdrawal = observer(() => {
    const active_wallet = useActiveWallet();
    const { client, modules, ui } = useStore();
    const { is_mobile } = ui;
    const { iframe, withdraw, transaction_history } = modules.cashier;
    const { iframe_url } = iframe;
    const {
        verification_code: { payment_withdraw: verification_code },
    } = client;
    const { is_withdraw_confirmed } = withdraw;
    const { is_crypto_transactions_visible } = transaction_history;
    const { getConfig } = useCurrencyConfig();
    const currency_config = getConfig(active_wallet?.currency || '');
    const is_crypto = currency_config?.is_crypto;

    if (is_crypto && (verification_code || is_withdraw_confirmed || is_crypto_transactions_visible)) {
        return <CryptoWithdrawal is_wallet />;
    }

    if (!is_crypto && (verification_code || iframe_url)) {
        return (
            <Div100vhContainer
                height_offset={is_mobile ? '14rem' : '26.8rem'}
                className='wallet-withdrawal__fiat-container'
            >
                <Withdraw is_appstore />
            </Div100vhContainer>
        );
    }

    return <WithdrawalVerificationEmail />;
});

export default WalletWithdrawal;
