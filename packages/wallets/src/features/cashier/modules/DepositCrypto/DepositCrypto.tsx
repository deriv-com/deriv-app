import React from 'react';
import { useActiveWalletAccount, useCurrencyConfig, useDepositCryptoAddress } from '@deriv/api-v2';
import { Divider, useDevice } from '@deriv-com/ui';
import { WalletLoader } from '../../../../components';
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
    const { isDesktop } = useDevice();

    const depositCryptoError = error?.error;
    const isTUSDT = activeWallet?.currency && getConfig(activeWallet.currency)?.is_tUSDT;
    const isOnrampAvailable = activeWallet?.currency_config && activeWallet.currency_config.platform.ramp.length > 0;

    if (isLoading) return <WalletLoader />;

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
                {(!isDesktop || isOnrampAvailable) && <Divider color='var(--border-divider)' height={2} />}
                {isOnrampAvailable && <DepositCryptoTryFiatOnRamp />}
            </div>
            <div className='wallets-deposit-crypto__right-content'>
                <TransactionStatus transactionType='deposit' />
            </div>
        </div>
    );
};

export default DepositCrypto;
