import React from 'react';
import { Div100vhContainer } from '@deriv/components';
import { useActiveWallet } from '@deriv/hooks';
import { useStore, observer } from '@deriv/stores';
import Withdraw from '@deriv/cashier/src/pages/withdrawal/withdraw';
import WithdrawalVerificationEmail from '@deriv/cashier/src/pages/withdrawal/withdrawal-verification-email';
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

    if (!active_wallet?.currency_config?.is_crypto && (verification_code || iframe_url)) {
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
