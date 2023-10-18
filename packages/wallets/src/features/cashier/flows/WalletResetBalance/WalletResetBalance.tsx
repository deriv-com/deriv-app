import React from 'react';
import { useActiveWalletAccount, useMutation } from '@deriv/api';
import { useHistory } from 'react-router-dom';
import useDevice from '../../../../hooks/useDevice';
import WalletButton from '../../../../components/Base/WalletButton/WalletButton';
import WalletText from '../../../../components/Base/WalletText/WalletText';
import IcResetDemoBalance from '../../../../public/images/ic-demo-reset-balance.svg';
import IcResetDemoBalanceDone from '../../../../public/images/ic-demo-reset-balance-done.svg';
import './WalletResetBalance.scss';

const WalletResetBalance = () => {
    const history = useHistory();
    const { isSuccess: isResetBalanceSuccess, mutate } = useMutation('topup_virtual');
    const { data: activeWallet } = useActiveWalletAccount();
    const { isMobile } = useDevice();

    const resetBalance = () => {
        mutate();
    };

    const showResetButton = activeWallet?.balance !== 10000;

    return (
        <div className='wallets-reset-balance'>
            <div className='wallets-reset-balance__icon'>
                {isResetBalanceSuccess ? <IcResetDemoBalanceDone /> : <IcResetDemoBalance />}
            </div>

            <div className='wallets-reset-balance__title'>
                <WalletText size={isMobile ? 'lg' : '2xl'} weight='bold'>
                    Reset balance to 10,000.00 USD
                </WalletText>
            </div>

            <div className='wallets-reset-balance__subtitle'>
                <WalletText size={isMobile ? 'md' : 'lg'}>
                    {isResetBalanceSuccess ? (
                        <>Your balance has been reset to 10,000.00 USD.</>
                    ) : (
                        <> Reset your virtual balance if it falls below 10,000.00 USD or exceeds 10,000.00 USD.</>
                    )}
                </WalletText>
            </div>

            <div className='wallets-reset-balance__button'>
                {showResetButton && (
                    <WalletButton color='primary' onClick={resetBalance} size='lg' text='Reset balance' />
                )}

                {!showResetButton && (
                    <WalletButton
                        color='primary'
                        onClick={() => history.push(`/wallets/cashier/transfer`)}
                        size='lg'
                        text='Transfer funds'
                    />
                )}
            </div>
        </div>
    );
};

export default WalletResetBalance;
