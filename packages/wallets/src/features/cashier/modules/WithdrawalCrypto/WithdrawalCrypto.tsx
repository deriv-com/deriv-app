import React from 'react';
import { Loader, WalletText } from '../../../../components';
import { TransactionStatus } from '../TransactionStatus';
import { WithdrawalCryptoDisclaimer, WithdrawalCryptoForm, WithdrawalCryptoReceipt } from './components';
import { useWithdrawalCryptoContext, WithdrawalCryptoProvider } from './provider';
import './WithdrawalCrypto.scss';

type TWithdrawalCryptoProps = {
    onClose: () => void;
    setError: React.Dispatch<
        React.SetStateAction<
            | {
                  code: string;
                  message: string;
              }
            | undefined
        >
    >;
    verificationCode: string;
};

const WithdrawalCrypto: React.FC = () => {
    const {
        activeWallet,
        getCurrencyConfig,
        isTokenValidationLoading,
        isWithdrawalSuccess,
        onClose,
        withdrawalReceipt,
    } = useWithdrawalCryptoContext();

    if (isTokenValidationLoading) return <Loader />;

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

const WithdrawalCryptoModule: React.FC<TWithdrawalCryptoProps> = ({ onClose, setError, verificationCode }) => {
    return (
        <WithdrawalCryptoProvider onClose={onClose} setError={setError} verificationCode={verificationCode}>
            <WithdrawalCrypto />
        </WithdrawalCryptoProvider>
    );
};

export default WithdrawalCryptoModule;
