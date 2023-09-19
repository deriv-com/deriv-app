import React from 'react';
import { useActiveWalletAccount } from '@deriv/api';
import WalletDepositCryptoAddress from '../WalletDepositCryptoAddress/WalletDepositCryptoAddress';
import WalletDepositCryptoCurrencyDetails from '../WalletDepositCryptoCurrencyDetails/WalletDepositCryptoCurrencyDetails';
import WalletDepositCryptoDisclaimers from '../WalletDepositCryptoDisclaimers/WalletDepositCryptoDisclaimers';
import './WalletDepositCrypto.scss';

const WalletDepositCrypto = () => {
    const { data } = useActiveWalletAccount();

    return (
        <div className='wallets-deposit-crypto'>
            <WalletDepositCryptoCurrencyDetails
                name={data?.currency_config?.name}
                display_code={data?.currency_config?.display_code}
            />
            <WalletDepositCryptoAddress />
            <WalletDepositCryptoDisclaimers data={data} />
        </div>
    );
};

export default WalletDepositCrypto;
