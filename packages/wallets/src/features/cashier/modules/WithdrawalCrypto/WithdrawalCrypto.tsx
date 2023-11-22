import React, { useState } from 'react';
import { useActiveWalletAccount, useCryptoWithdrawal, useCurrencyConfig } from '@deriv/api';
import { WalletText } from '../../../../components';
import { TransactionStatus } from '../TransactionStatus';
import { WithdrawalCryptoDisclaimer, WithdrawalCryptoForm, WithdrawalCryptoReceipt } from './components';
import './WithdrawalCrypto.scss';

type TWithdrawalCryptoProps = {
    onClose: () => void;
    verificationCode: string;
};

type TWithdrawalReceipt = {
    address: string;
    amount: string;
    currency?: string;
};

const WithdrawalCrypto: React.FC<TWithdrawalCryptoProps> = ({ onClose, verificationCode }) => {
    const { data: activeWallet } = useActiveWalletAccount();
    const { isSuccess: isWithdrawalSuccess, mutateAsync } = useCryptoWithdrawal();
    const { getConfig } = useCurrencyConfig();
    const [withdrawalReceipt, setWithdrawalReceipt] = useState<TWithdrawalReceipt>({ address: '', amount: '' });

    if (isWithdrawalSuccess) return <WithdrawalCryptoReceipt onClose={onClose} withdrawalReceipt={withdrawalReceipt} />;

    return (
        <div className='wallets-withdrawal-crypto'>
            <div className='wallets-withdrawal-crypto__content'>
                <WalletText weight='bold'>
                    Withdraw {activeWallet?.currency ? getConfig(activeWallet?.currency)?.name : ''} (
                    {activeWallet?.currency}) to your wallet
                </WalletText>
                <WithdrawalCryptoDisclaimer />
                <WithdrawalCryptoForm
                    activeWallet={activeWallet}
                    getCurrencyConfig={getConfig}
                    onWithdrawalSuccess={(address, amount, currency) =>
                        setWithdrawalReceipt({ address, amount, currency })
                    }
                    requestCryptoWithdrawal={mutateAsync}
                    verificationCode={verificationCode}
                />
            </div>
            <TransactionStatus transactionType='withdrawal' />
        </div>
    );
};

export default WithdrawalCrypto;
