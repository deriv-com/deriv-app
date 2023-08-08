import React from 'react';
import { useActiveWallet, useCurrencyConfig } from '@deriv/hooks';
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
    const { iframe } = modules.cashier;
    const { iframe_url } = iframe;
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
