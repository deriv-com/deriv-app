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

const WithdrawalCrypto: React.FC = () => {
    const { activeWallet, getCurrencyConfig, isWithdrawalSuccess, onClose, withdrawalReceipt } =
        useWithdrawalCryptoContext();

    if (isWithdrawalSuccess) return <WithdrawalCryptoReceipt onClose={onClose} withdrawalReceipt={withdrawalReceipt} />;

    return (
        <div className='wallets-withdrawal-crypto'>
            <div className='wallets-withdrawal-crypto__side-pane' />
            <div className='wallets-withdrawal-crypto__content'>
                <WalletText weight='bold'>
                    Withdraw {activeWallet?.currency ? getCurrencyConfig(activeWallet?.currency)?.name : ''} (
                    {activeWallet?.currency}) to your wallet
                </WalletText>
                <WithdrawalCryptoDisclaimer />
                <WithdrawalCryptoForm />
            </div>
            <div className='wallets-withdrawal-crypto__side-pane'>
                <TransactionStatus transactionType='withdrawal' />
            </div>
        </div>
    );
};

const WithdrawalCryptoModule: React.FC<TWithdrawalCryptoProps> = ({ onClose, verificationCode }) => {
    return (
        <WithdrawalCryptoProvider onClose={onClose} verificationCode={verificationCode}>
            <WithdrawalCrypto />
        </WithdrawalCryptoProvider>
    );
};

export default WithdrawalCryptoModule;
