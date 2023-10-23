import React from 'react';
import { useActiveWalletAccount, useMutation } from '@deriv/api';
import { useHistory } from 'react-router-dom';
import IcResetDemoBalance from '../../../../public/images/ic-demo-reset-balance.svg';
import IcResetDemoBalanceDone from '../../../../public/images/ic-demo-reset-balance-done.svg';
import WalletsActionScreen from '../../../../components/WalletsActionScreen/WalletsActionScreen';

const ResetBalance = () => {
    const history = useHistory();
    const { isSuccess: isResetBalanceSuccess, mutate } = useMutation('topup_virtual');
    const { data: activeWallet } = useActiveWalletAccount();

    const resetBalance = () => {
        mutate();
    };

    const canReset = activeWallet?.balance !== 10000;

    return (
        <WalletsActionScreen
            action={{
                actionText: canReset ? 'Reset balance' : 'Transfer funds',
                onAction: canReset ? resetBalance : () => history.push(`/wallets/cashier/transfer`),
            }}
            description={
                isResetBalanceSuccess
                    ? 'Your balance has been reset to 10,000.00 USD.'
                    : 'Reset your virtual balance if it falls below 10,000.00 USD or exceeds 10,000.00 USD.'
            }
            icon={isResetBalanceSuccess ? <IcResetDemoBalanceDone /> : <IcResetDemoBalance />}
            title={'Reset balance to 10,000.00 USD'}
        />
    );
};

export default ResetBalance;
