import React from 'react';
import { useActiveWalletAccount, useCurrencyConfig } from '@deriv/api';
import { WalletText } from '../../../../components';
import { TransactionStatus } from '../TransactionStatus';
import { WithdrawalCryptoForm, WithdrawalDisclaimer } from './components';
import './WithdrawalCrypto.scss';

type TWithdrawalCryptoProps = {
    verificationCode: string;
};

const WithdrawalCrypto: React.FC<TWithdrawalCryptoProps> = ({ verificationCode }) => {
    const { data: activeWallet } = useActiveWalletAccount();
    const { getConfig } = useCurrencyConfig();

    return (
        <div className='wallets-withdrawal-crypto'>
            <div className='wallets-withdrawal-crypto__content'>
                <WalletText weight='bold'>
                    Withdraw {activeWallet?.currency ? getConfig(activeWallet?.currency)?.name : ''} (
                    {activeWallet?.currency}) to your wallet
                </WalletText>
                <WithdrawalDisclaimer />
                <WithdrawalCryptoForm
                    activeWallet={activeWallet}
                    getCurrencyConfig={getConfig}
                    verificationCode={verificationCode}
                />
            </div>
            <TransactionStatus transactionType='withdrawal' />
        </div>
    );
};

export default WithdrawalCrypto;
