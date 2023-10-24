import React from 'react';
import DepositCryptoAddress from './components/DepositCryptoAddress/DepositCryptoAddress';
import DepositCryptoCurrencyDetails from './components/DepositCryptoCurrencyDetails/DepositCryptoCurrencyDetails';
import DepositCryptoDisclaimers from './components/DepositCryptoDisclaimers/DepositCryptoDisclaimers';
import DepositCryptoTryFiatOnRamp from './components/DepositCryptoTryFiatOnRamp/DepositCryptoTryFiatOnRamp';
import { Divider } from '../../../../components/Base';
import './DepositCrypto.scss';

const DepositCrypto = () => {
    return (
        <div className='wallets-deposit-crypto'>
            <DepositCryptoCurrencyDetails />
            <DepositCryptoAddress />
            <DepositCryptoDisclaimers />
            <Divider />
            <DepositCryptoTryFiatOnRamp />
        </div>
    );
};

export default DepositCrypto;
