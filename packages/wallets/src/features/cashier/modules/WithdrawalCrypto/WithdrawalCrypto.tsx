import React from 'react';
import { Localize } from '@deriv-com/translations';
import { Text } from '@deriv-com/ui';
import { WalletLoader } from '../../../../components';
import { isServerError } from '../../../../utils/utils';
import { WithdrawalErrorScreen } from '../../screens';
import { TransactionStatus } from '../TransactionStatus';
import { WithdrawalCryptoDisclaimer, WithdrawalCryptoForm, WithdrawalCryptoReceipt } from './components';
import { useWithdrawalCryptoContext, WithdrawalCryptoProvider } from './provider';
import './WithdrawalCrypto.scss';

type TWithdrawalCryptoProps = {
    setResendEmail: React.Dispatch<React.SetStateAction<boolean>>;
    setVerificationCode: React.Dispatch<React.SetStateAction<string>>;
    verificationCode: string;
};

const WithdrawalCrypto: React.FC<Pick<TWithdrawalCryptoProps, 'setResendEmail' | 'setVerificationCode'>> = ({
    setResendEmail,
    setVerificationCode,
}) => {
    const { activeWallet, error, getCurrencyConfig, isLoading, isWithdrawalSuccess, setError, withdrawalReceipt } =
        useWithdrawalCryptoContext();

    const onCloseHandler = () => setVerificationCode('');
    const currency = activeWallet?.currency;

    const resetError = () => {
        onCloseHandler();
        setError(undefined);
    };

    if (isLoading) return <WalletLoader />;

    if (isServerError(error)) {
        return <WithdrawalErrorScreen error={error} resetError={resetError} setResendEmail={setResendEmail} />;
    }

    if (isWithdrawalSuccess) {
        return <WithdrawalCryptoReceipt onClose={onCloseHandler} withdrawalReceipt={withdrawalReceipt} />;
    }

    return (
        <div className='wallets-withdrawal-crypto'>
            <div className='wallets-withdrawal-crypto__left-content' /> {/* This div is used for alignment */}
            <div className='wallets-withdrawal-crypto__main-content'>
                <Text weight='bold'>
                    <Localize
                        i18n_default_text='Withdraw {{currencyName}} ({{currency}}) to your wallet'
                        values={{ currency, currencyName: currency ? getCurrencyConfig(currency)?.name : '' }}
                    />
                </Text>
                <WithdrawalCryptoDisclaimer />
                <WithdrawalCryptoForm />
            </div>
            <div className='wallets-withdrawal-crypto__right-content'>
                <TransactionStatus transactionType='withdrawal' />
            </div>
        </div>
    );
};

const WithdrawalCryptoModule: React.FC<TWithdrawalCryptoProps> = ({
    setResendEmail,
    setVerificationCode,
    verificationCode,
}) => {
    return (
        <WithdrawalCryptoProvider verificationCode={verificationCode}>
            <WithdrawalCrypto setResendEmail={setResendEmail} setVerificationCode={setVerificationCode} />
        </WithdrawalCryptoProvider>
    );
};

export default WithdrawalCryptoModule;
