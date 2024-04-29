import React from 'react';
import { useActiveWalletAccount, useCryptoConfig } from '@deriv/api-v2';
import { InlineMessage, WalletText } from '../../../../../../components/Base';
import './DepositCryptoDisclaimers.scss';

// Check with BE to see if we can get the network name from the API.
const cryptoCurrencyToNetworkMapper: Record<string, string> = {
    BTC: 'Bitcoin (BTC)',
    ETH: 'Ethereum (ETH)',
    eUSDT: 'Ethereum (ERC20) ',
    LTC: 'Litecoin (LTC)',
    tUSDT: 'Tron (TRC20) ',
    USDC: 'Ethereum (ERC20)',
    UST: 'Omnicore',
};

const DepositCryptoDisclaimers = () => {
    const { data } = useActiveWalletAccount();
    const { data: cryptoConfig } = useCryptoConfig();
    const { currency } = data || {};
    const formattedMinimumDepositValue = cryptoConfig?.minimum_deposit?.toFixed(
        data?.currency_config?.fractional_digits
    );

    const minimumDepositDisclaimer = data?.currency_config?.is_tUSDT ? (
        <li>
            A minimum deposit value of <strong>{formattedMinimumDepositValue}</strong> {currency} is required.
            Otherwise, a fee is applied.
        </li>
    ) : (
        <li>
            A minimum deposit value of <strong>{formattedMinimumDepositValue}</strong> {currency} is required.
            Otherwise, the funds will be lost and cannot be recovered.
        </li>
    );

    return (
        <div className='wallets-deposit-crypto-disclaimers'>
            <InlineMessage>
                <div className='wallets-deposit-crypto-disclaimers__content'>
                    <WalletText size='2xs' weight='bold'>
                        To avoid loss of funds:
                    </WalletText>
                    <ul className='wallets-deposit-crypto-disclaimers__points'>
                        {cryptoConfig?.minimum_deposit && minimumDepositDisclaimer}
                        <li>Do not send other cryptocurrencies to this address.</li>
                        <li>Make sure to copy your Deriv account address correctly into your crypto wallet.</li>
                        <li>
                            In your cryptocurrency wallet, make sure to select{' '}
                            <strong>{currency && cryptoCurrencyToNetworkMapper[currency]} network</strong> when you
                            transfer funds to Deriv.
                        </li>
                    </ul>
                </div>
            </InlineMessage>
            <div className='wallets-deposit-crypto-disclaimers__note'>
                <WalletText size='xs' weight='bold'>
                    Note:
                </WalletText>
                <WalletText size='xs'>
                    &nbsp;You’ll receive an email when your deposit starts being processed.
                </WalletText>
            </div>
        </div>
    );
};

export default DepositCryptoDisclaimers;
