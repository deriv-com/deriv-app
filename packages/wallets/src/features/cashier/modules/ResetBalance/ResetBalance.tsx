import React from 'react';
import { useHistory } from 'react-router-dom';
import { useMutation } from '@deriv/api';
import WalletsActionScreen from '../../../../components/WalletsActionScreen/WalletsActionScreen';
import IcResetDemoBalance from '../../../../public/images/ic-demo-reset-balance.svg';
import IcResetDemoBalanceDone from '../../../../public/images/ic-demo-reset-balance-done.svg';
import './ResetBalance.scss';

const ResetBalance = () => {
    const history = useHistory();
    const { isSuccess: isResetBalanceSuccess, mutate } = useMutation('topup_virtual');

    const resetBalance = () => {
        mutate();
    };
    return (
        <div className='wallets-reset-balance'>
            <WalletsActionScreen
                actionText={isResetBalanceSuccess ? 'Transfer funds' : 'Reset balance'}
                description={
                    isResetBalanceSuccess
                        ? 'Your balance has been reset to 10,000.00 USD.'
                        : 'Reset your virtual balance to 10,000.00 USD.'
                }
                icon={isResetBalanceSuccess ? <IcResetDemoBalanceDone /> : <IcResetDemoBalance />}
                onAction={isResetBalanceSuccess ? () => history.push(`/wallets/cashier/transfer`) : resetBalance}
                title={isResetBalanceSuccess ? 'Success' : 'Reset balance'}
            />
        </div>
    );
};

export default ResetBalance;
