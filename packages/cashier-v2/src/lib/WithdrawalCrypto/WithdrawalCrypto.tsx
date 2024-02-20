import React from 'react';
import { Text } from '@deriv-com/ui';
import WithdrawalCryptoProvider, { useWithdrawalCryptoContext } from './provider/WithdrawalCryptoProvider';
import { WithdrawalCryptoDisclaimer, WithdrawalCryptoForm, WithdrawalCryptoReceipt } from './components';
import styles from './WithdrawalCrypto.module.scss';

type TWithdrawalCryptoProps = {
    onClose: () => void;
    verificationCode: string;
};

const WithdrawalCrypto: React.FC = () => {
    const { activeAccount, getCurrencyConfig, isWithdrawalSuccess, onClose, withdrawalReceipt } =
        useWithdrawalCryptoContext();

    if (isWithdrawalSuccess) return <WithdrawalCryptoReceipt onClose={onClose} withdrawalReceipt={withdrawalReceipt} />;

    return (
        <div className={styles.container}>
            <div className={styles['side-pane']} />
            <div className={styles.content}>
                <Text weight='bold'>
                    Withdraw {activeAccount?.currency ? getCurrencyConfig(activeAccount?.currency)?.name : ''} (
                    {activeAccount?.currency}) to your wallet
                </Text>
                <WithdrawalCryptoDisclaimer />
                <WithdrawalCryptoForm />
            </div>
            <div className={styles['side-pane']} />
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
