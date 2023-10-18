import React from 'react';
import { useActiveWalletAccount, useRequest } from '@deriv/api';
import { Icon, Text, Button } from '@deriv/components';
import { useHistory } from 'react-router-dom';
import useDevice from '../../../../hooks/useDevice';
import WalletButton from '../../../../components/Base/WalletButton/WalletButton';

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
        <div className='wallets-transactions-no-data-state'>
            <Icon icon={isResetBalanceSuccess ? 'IcDemoResetBalanceDone' : 'IcDemoResetBalance'} size='128' />
            <p>Reset balance to 10,000.00 USD</p>
            <Text
                as='p'
                className='reset-balance__title'
                line_height={isMobile ? 'xl' : 'xxl'}
                size={isMobile ? 's' : 'sm'}
                weight='bold'
            >
                {isResetBalanceSuccess ? (
                    <>Your balance has been reset to 10,000.00 USD.</>
                ) : (
                    <>Reset your virtual balance if it falls below 10,000.00 USD or exceeds 10,000.00 USD.</>
                )}
            </Text>

            <div className='wallets-transactions-no-data-state__buttons'>
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
