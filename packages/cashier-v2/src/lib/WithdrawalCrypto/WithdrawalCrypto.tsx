import React from 'react';
import { Text } from '@deriv-com/ui';
import { WithdrawalCryptoDisclaimer, WithdrawalCryptoForm, WithdrawalCryptoReceipt } from './components';
import { useWithdrawalCryptoContext, WithdrawalCryptoProvider } from './provider';
import styles from './WithdrawalCrypto.module.scss';

type TWithdrawalCryptoProps = {
    setVerificationCode: React.Dispatch<React.SetStateAction<string>>;
    verificationCode: string;
};

const WithdrawalCrypto: React.FC = () => {
    const { activeAccount, getCurrencyConfig, isWithdrawalSuccess } = useWithdrawalCryptoContext();

    if (isWithdrawalSuccess) return <WithdrawalCryptoReceipt />;

    return (
        <div className={styles.container}>
            <div className={styles.content}>
                <Text weight='bold'>
                    Withdraw {activeAccount?.currency ? getCurrencyConfig(activeAccount?.currency)?.name : ''} (
                    {activeAccount?.currency}) to your wallet
                </Text>
                <WithdrawalCryptoDisclaimer />
                <WithdrawalCryptoForm />
            </div>
        </div>
    );
};

const WithdrawalCryptoModule: React.FC<TWithdrawalCryptoProps> = ({ setVerificationCode, verificationCode }) => {
    return (
        <WithdrawalCryptoProvider setVerificationCode={setVerificationCode} verificationCode={verificationCode}>
            <WithdrawalCrypto />
        </WithdrawalCryptoProvider>
    );
};

export default WithdrawalCryptoModule;
