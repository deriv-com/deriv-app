import React from 'react';
import { WalletText } from '../../../../components';
import { TransactionStatus } from '../TransactionStatus';
import { WithdrawalCryptoForm, WithdrawalDisclaimer } from './components';
import './WithdrawalCrypto.scss';

type TWithdrawalCryptoProps = {
    verificationCode?: string;
};

const WithdrawalCrypto: React.FC<TWithdrawalCryptoProps> = ({ verificationCode }) => {
    return (
        <div className='wallets-withdrawal-crypto-container'>
            <div className='wallets-withdrawal-crypto'>
                <WalletText weight='bold'>Withdraw Bitcoin (BTC) to your wallet</WalletText>
                <WithdrawalDisclaimer />
                <WithdrawalCryptoForm verificationCode={verificationCode} />
            </div>
            <TransactionStatus transactionType='withdrawal' />
        </div>
    );
};

export default WithdrawalCrypto;
