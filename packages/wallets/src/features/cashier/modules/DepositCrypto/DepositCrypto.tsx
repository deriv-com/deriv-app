import React from 'react';
import { useActiveWalletAccount, useCurrencyConfig, useDepositCryptoAddress } from '@deriv/api-v2';
import { Divider, Loader } from '@deriv-com/ui';
import { isServerError } from '../../../../utils/utils';
import { DepositErrorScreen } from '../../screens';
import { TransactionStatus } from '../TransactionStatus';
import DepositCryptoAddress from './components/DepositCryptoAddress/DepositCryptoAddress';
import DepositCryptoCurrencyDetails from './components/DepositCryptoCurrencyDetails/DepositCryptoCurrencyDetails';
import DepositCryptoDisclaimers from './components/DepositCryptoDisclaimers/DepositCryptoDisclaimers';
import DepositCryptoInfoNotice from './components/DepositCryptoInfoNotice/DepositCryptoInfoNotice';
import DepositCryptoTryFiatOnRamp from './components/DepositCryptoTryFiatOnRamp/DepositCryptoTryFiatOnRamp';
import './DepositCrypto.scss';

const DepositCrypto = () => {
    const { data: depositCryptoAddress, error, isLoading } = useDepositCryptoAddress();
    const { data: activeWallet } = useActiveWalletAccount();
    const { getConfig } = useCurrencyConfig();

    const depositCryptoError = error?.error;
    const isTUSDT = activeWallet?.currency && getConfig(activeWallet.currency)?.is_tUSDT;

    if (isLoading) return <Loader />;

    if (isServerError(depositCryptoError)) {
        return <DepositErrorScreen error={depositCryptoError} />;
    }

    return (
        <div className='wallets-deposit-crypto'>
            <div className='wallets-deposit-crypto__left-content' /> {/* This div is used for alignment */}
            <div className='wallets-deposit-crypto__main-content'>
                {isTUSDT && <DepositCryptoInfoNotice />}
                <DepositCryptoCurrencyDetails />
                <DepositCryptoAddress depositCryptoAddress={depositCryptoAddress} />
                <DepositCryptoDisclaimers />
                <Divider color='var(--border-divider)' height={2} />
                <DepositCryptoTryFiatOnRamp />
            </div>
            <div className='wallets-deposit-crypto__right-content'>
                <TransactionStatus transactionType='deposit' />
            </div>
        </div>
    );
};

export default DepositCrypto;
