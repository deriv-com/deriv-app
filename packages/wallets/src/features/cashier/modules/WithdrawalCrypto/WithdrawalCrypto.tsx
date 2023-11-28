import React, { useState } from 'react';
import { useActiveWalletAccount, useCryptoWithdrawal, useCurrencyConfig } from '@deriv/api';
import { WalletText } from '../../../../components';
import { THooks } from '../../../../types';
import { TransactionStatus } from '../TransactionStatus';
import { WithdrawalCryptoDisclaimer, WithdrawalCryptoForm, WithdrawalCryptoReceipt } from './components';
import { TWithdrawalReceipt } from './types';
import './WithdrawalCrypto.scss';

type TWithdrawalCryptoProps = {
    onClose: () => void;
    verificationCode: string;
};

const WithdrawalCrypto: React.FC<TWithdrawalCryptoProps> = ({ onClose, verificationCode }) => {
    const { data: activeWallet } = useActiveWalletAccount();
    const { isSuccess: isWithdrawalSuccess, mutateAsync } = useCryptoWithdrawal();
    const { getConfig } = useCurrencyConfig();
    const [withdrawalReceipt, setWithdrawalReceipt] = useState<TWithdrawalReceipt>({ address: '' });

    const requestCryptoWithdrawal = (values: Parameters<THooks.CryptoWithdrawal>[0]) => {
        const { address, amount, verification_code: verificationCode } = values;
        mutateAsync({
            address,
            amount,
            verification_code: verificationCode,
        }).then(() =>
            setWithdrawalReceipt({
                address,
                amount: amount?.toFixed(activeWallet?.currency_config?.fractional_digits),
                currency: activeWallet?.currency,
                landingCompany: activeWallet?.landing_company_name,
            })
        );
    };
    if (isWithdrawalSuccess) return <WithdrawalCryptoReceipt onClose={onClose} withdrawalReceipt={withdrawalReceipt} />;

    return (
        <div className='wallets-withdrawal-crypto'>
            <div className='wallets-withdrawal-crypto__side-pane' />
            <div className='wallets-withdrawal-crypto__content'>
                <WalletText weight='bold'>
                    Withdraw {activeWallet?.currency ? getConfig(activeWallet?.currency)?.name : ''} (
                    {activeWallet?.currency}) to your wallet
                </WalletText>
                <WithdrawalCryptoDisclaimer />
                <WithdrawalCryptoForm
                    activeWallet={activeWallet}
                    getCurrencyConfig={getConfig}
                    requestCryptoWithdrawal={requestCryptoWithdrawal}
                    verificationCode={verificationCode}
                />
            </div>
            <div className='wallets-withdrawal-crypto__side-pane'>
                <TransactionStatus transactionType='withdrawal' />
            </div>
        </div>
    );
};

export default WithdrawalCrypto;
