import React from 'react';
import { useActiveWalletAccount } from '@deriv/api';
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
    const { currency } = data || {};

    return (
        <div className='wallets-deposit-crypto-disclaimers'>
            <InlineMessage>
                <div className='wallets-deposit-crypto-disclaimers__content'>
                    <WalletText size='2xs' weight='bold'>
                        To avoid loss of funds:
                    </WalletText>
                    <div className='wallets-deposit-crypto-disclaimers__points'>
                        {data?.currency_config?.minimum_deposit && (
                            <>
                                <span>
                                    A minimum deposit value of {data?.currency_config?.minimum_deposit} {currency} is
                                    required. Otherwise, the funds will be lost and cannot be recovered.
                                </span>
                            </>
                        )}
                        <span>Do not send other cryptocurrencies to this address.</span>
                        <span>Make sure to copy your Deriv account address correctly into your crypto wallet.</span>
                        <span>
                            In your cryptocurrency wallet, make sure to select{' '}
                            <strong>{currency && cryptoCurrencyToNetworkMapper[currency]} network</strong> when you
                            transfer funds to Deriv.
                        </span>
                    </div>
                </div>
            </InlineMessage>
            <div className='wallets-deposit-crypto-disclaimers__note'>
                <WalletText size='xs' weight='bold'>
                    Note:
                </WalletText>
                <WalletText size='xs'>
                    &nbsp;You’ll receive an email when your deposit start being processed.
                </WalletText>
            </div>
        </div>
    );
};

export default DepositCryptoDisclaimers;
