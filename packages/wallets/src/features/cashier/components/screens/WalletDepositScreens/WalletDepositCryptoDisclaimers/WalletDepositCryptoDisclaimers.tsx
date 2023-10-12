import React from 'react';
import { useActiveWalletAccount } from '@deriv/api';
import useDevice from '../../hooks/useDevice';
import { InlineMessage } from '../InlineMessage';
import './WalletDepositCryptoDisclaimers.scss';

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

const WalletDepositCryptoDisclaimers = () => {
    const { data } = useActiveWalletAccount();
    const { isMobile } = useDevice();
    const { currency } = data || {};

    return (
        <div className='wallets-deposit-crypto-disclaimers'>
            <InlineMessage>
                <div className='wallets-deposit-crypto-disclaimers__content'>
                    <p>To avoid loss of funds:</p>
                    <br />
                    {data?.currency_config?.minimum_deposit && (
                        <li>
                            A minimum deposit value of {data?.currency_config?.minimum_deposit} {currency} is required.
                            Otherwise, the funds will be lost and cannot be recovered.
                        </li>
                    )}
                    <li>Do not send other currencies to this address.</li>
                    <li>Make sure to copy your Deriv account address correctly into your crypto wallet.</li>
                    <li>
                        In your cryptocurrency wallet, make sure to select{' '}
                        <strong>{currency && cryptoCurrencyToNetworkMapper[currency]} network</strong> when you transfer
                        funds to Deriv.
                    </li>
                </div>
            </InlineMessage>
            <p className='wallets-deposit-crypto-disclaimers__note' style={{ fontSize: isMobile ? ' 1rem' : '1.2rem' }}>
                <strong>Note:</strong> You’ll receive an email when your deposit start being processed.
            </p>
        </div>
    );
};

export default WalletDepositCryptoDisclaimers;
