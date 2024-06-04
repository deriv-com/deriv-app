import React from 'react';
import { useHistory } from 'react-router-dom';
import { useMutation } from '@deriv/api-v2';
import { WalletButton, WalletsActionScreen } from '../../../../components';
//TODO: replace with quill-icons
import IcResetDemoBalance from '../../../../public/images/ic-demo-reset-balance.svg';
import IcResetDemoBalanceDone from '../../../../public/images/ic-demo-reset-balance-done.svg';

const ResetBalance = () => {
    const history = useHistory();
    const { isSuccess: isResetBalanceSuccess, mutate } = useMutation('topup_virtual');

    const resetBalance = () => {
        mutate();
    };
    return (
        <WalletsActionScreen
            description={
                isResetBalanceSuccess
                    ? 'Your balance has been reset to 10,000.00 USD.'
                    : 'Reset your virtual balance to 10,000.00 USD.'
            }
            icon={isResetBalanceSuccess ? <IcResetDemoBalanceDone /> : <IcResetDemoBalance />}
            renderButtons={() => (
                <WalletButton
                    onClick={isResetBalanceSuccess ? () => history.push('/wallet/account-transfer') : resetBalance}
                    size='lg'
                >
                    {isResetBalanceSuccess ? 'Transfer funds' : 'Reset balance'}
                </WalletButton>
            )}
            title={isResetBalanceSuccess ? 'Success' : 'Reset balance'}
        />
    );
};

export default ResetBalance;
