import React from 'react';
import { useActiveWalletAccount, useRequest } from '@deriv/api';
import { useHistory } from 'react-router-dom';
import useDevice from '../../../../hooks/useDevice';
import WalletButton from '../../../../components/Base/WalletButton/WalletButton';
import WalletText from '../../../../components/Base/WalletText/WalletText';
import IcResetDemoBalance from '../../../../public/images/ic-demo-reset-balance.svg';
import IcResetDemoBalanceDone from '../../../../public/images/ic-demo-reset-balance-done.svg';

const WalletResetBalance = () => {
    const history = useHistory();
    const { isSuccess: isResetBalanceSuccess, mutate } = useRequest('topup_virtual');
    const { data: activeWallet } = useActiveWalletAccount();
    const canResetBalance = activeWallet?.balance !== 10000;
    const { isMobile } = useDevice();

    const resetBalance = () => {
        mutate();
    };

    return (
        <div className='wallets-reset-balance'>
            {isResetBalanceSuccess ? <IcResetDemoBalanceDone /> : <IcResetDemoBalance />}
            <div>
                <WalletText>Reset balance to 10,000.00 USD</WalletText>
            </div>

            <div>
                {isResetBalanceSuccess ? (
                    <WalletText>Your balance has been reset to 10,000.00 USD.</WalletText>
                ) : (
                    <WalletText>
                        Reset your virtual balance if it falls below 10,000.00 USD or exceeds 10,000.00 USD.
                    </WalletText>
                )}
            </div>

            <div>
                <WalletButton
                    color='primary'
                    disabled={!canResetBalance}
                    onClick={resetBalance}
                    size='lg'
                    text='Reset balance'
                />

                <WalletButton
                    color='primary-light'
                    onClick={() => history.push(`/wallets/cashier/transfer`)}
                    size='lg'
                    text='Transfer funds'
                />
            </div>
        </div>
    );
};

export default WalletResetBalance;
