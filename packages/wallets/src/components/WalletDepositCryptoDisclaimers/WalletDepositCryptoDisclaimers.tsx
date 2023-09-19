import React from 'react';
import { useActiveWalletAccount } from '@deriv/api';
import useDevice from '../../hooks/useDevice';
import { InlineMessage } from '../InlineMessage';
import './WalletDepositCryptoDisclaimers.scss';

type TProps = {
    data: ReturnType<typeof useActiveWalletAccount>['data'];
};

// Check with BE to see if we can get the network name from the API.
const crypto_currency_to_network_mapper: Record<string, string> = {
    BTC: 'Bitcoin (BTC)',
    ETH: 'Ethereum (ETH)',
    LTC: 'Litecoin (LTC)',
    UST: 'Omnicore',
    USDC: 'Ethereum (ERC20)',
    eUSDT: 'Ethereum (ERC20) ',
    tUSDT: 'Tron (TRC20) ',
};

const WalletDepositCryptoDisclaimers = ({ data }: TProps) => {
    const { is_mobile } = useDevice();
    const { currency, currency_config } = data || {};

    return (
        <div className='wallets-deposit-crypto-disclaimers'>
            <InlineMessage>
                <div>
                    <h4>To avoid loss of funds:</h4>
                    <br />
                    {currency_config?.minimum_deposit && (
                        <li>
                            A minimum deposit value of {currency_config?.minimum_deposit} {currency} is required.
                            Otherwise, the funds will be lost and cannot be recovered.
                        </li>
                    )}
                    <li>Do not send other currencies to this address.</li>
                    <li>Make sure to copy your Deriv account address correctly into your crypto wallet.</li>
                    <li>
                        In your cryptocurrency wallet, make sure to select{' '}
                        <strong>{currency && crypto_currency_to_network_mapper[currency]} network</strong> when you
                        transfer funds to Deriv.
                    </li>
                </div>
            </InlineMessage>
            <h3
                className='wallets-deposit-crypto-disclaimers__note'
                style={{ fontSize: is_mobile ? ' 1rem' : '1.2rem' }}
            >
                <strong>Note:</strong> You’ll receive an email when your deposit start being processed.
            </h3>
        </div>
    );
};

export default WalletDepositCryptoDisclaimers;
