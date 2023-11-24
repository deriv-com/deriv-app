import React from 'react';
import { WalletText } from '../../../../components';
import { TransactionStatus } from '../TransactionStatus';
import WithdrawalCryptoProvider, { useWithdrawalCryptoContext } from './provider/WithdrawalCryptoProvider';
import { WithdrawalCryptoDisclaimer, WithdrawalCryptoForm, WithdrawalCryptoReceipt } from './components';
import './WithdrawalCrypto.scss';

type TWithdrawalCryptoProps = {
    onClose: () => void;
    verificationCode: string;
};

const WithdrawalCrypto: React.FC<TWithdrawalCryptoProps> = ({ onClose, verificationCode }) => {
    const { activeWallet, getCurrencyConfig, isWithdrawalSuccess, requestCryptoWithdrawal, withdrawalReceipt } =
        useWithdrawalCryptoContext();

    if (isWithdrawalSuccess) return <WithdrawalCryptoReceipt onClose={onClose} withdrawalReceipt={withdrawalReceipt} />;

    return (
        <div className='wallets-withdrawal-crypto'>
            <div className='wallets-withdrawal-crypto__content'>
                <WalletText weight='bold'>
                    Withdraw {activeWallet?.currency ? getCurrencyConfig(activeWallet?.currency)?.name : ''} (
                    {activeWallet?.currency}) to your wallet
                </WalletText>
                <WithdrawalCryptoDisclaimer />
                <WithdrawalCryptoForm
                    getCurrencyConfig={getCurrencyConfig}
                    requestCryptoWithdrawal={requestCryptoWithdrawal}
                    verificationCode={verificationCode}
                />
            </div>
            <TransactionStatus transactionType='withdrawal' />
        </div>
    );
};

const WithdrawalCryptoModule: React.FC<TWithdrawalCryptoProps> = ({ onClose, verificationCode }) => {
    return (
        <WithdrawalCryptoProvider>
            <WithdrawalCrypto onClose={onClose} verificationCode={verificationCode} />
        </WithdrawalCryptoProvider>
    );
};

export default WithdrawalCryptoModule;
