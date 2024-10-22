import React from 'react';
import { useActiveWalletAccount, useCryptoConfig } from '@deriv/api-v2';
import { Localize } from '@deriv-com/translations';
import { InlineMessage, Text } from '@deriv-com/ui';
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
            <Localize
                components={[<strong key={0} />]}
                i18n_default_text='A minimum deposit value of <0>{{formattedMinimumDepositValue}}</0> {{currency}} is required. Otherwise, a fee is applied.'
                values={{ currency, formattedMinimumDepositValue }}
            />
        </li>
    ) : (
        <li>
            <Localize
                components={[<strong key={0} />]}
                i18n_default_text='A minimum deposit value of <0>{{formattedMinimumDepositValue}}</0> {{currency}} is required. Otherwise, the funds will be lost and cannot be recovered.'
                values={{ currency, formattedMinimumDepositValue }}
            />
        </li>
    );

    return (
        <div className='wallets-deposit-crypto-disclaimers'>
            <InlineMessage iconPosition='top' variant='warning'>
                <div className='wallets-deposit-crypto-disclaimers__content'>
                    <Text size='2xs' weight='bold'>
                        <Localize i18n_default_text='To avoid loss of funds:' />
                    </Text>
                    <ul className='wallets-deposit-crypto-disclaimers__points'>
                        {cryptoConfig?.minimum_deposit && minimumDepositDisclaimer}
                        <li>
                            <Localize
                                i18n_default_text='Only send {{currencyConfigName}} ({{currencyConfigCode}}) to this address.'
                                values={{
                                    currencyConfigCode: data?.currency_config?.display_code,
                                    currencyConfigName: data?.currency_config?.name,
                                }}
                            />
                        </li>
                        <li>
                            <Localize
                                i18n_default_text='Make sure to copy the Deriv {{currency}} Wallet address above and paste it into your crypto wallet.'
                                values={{ currency }}
                            />
                        </li>
                        <li>
                            <Localize
                                components={[<strong key={0} />]}
                                i18n_default_text='In your crypto wallet, select the <0>{{currency}} network</0> when transferring to Deriv. Incorrect transfers may result in the loss of funds.'
                                values={{ currency: currency && cryptoCurrencyToNetworkMapper[currency] }}
                            />
                        </li>
                    </ul>
                </div>
            </InlineMessage>
            <div className='wallets-deposit-crypto-disclaimers__note'>
                <Text size='xs'>
                    <Localize
                        components={[<strong key={0} />]}
                        i18n_default_text="<0>Note:</0> You'll receive an email when your deposit starts being processed."
                    />
                </Text>
            </div>
        </div>
    );
};

export default DepositCryptoDisclaimers;
