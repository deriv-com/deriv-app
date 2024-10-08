import React from 'react';
import { InlineMessage, Text } from '@deriv/components';
import { useCryptoConfig, useCurrentCurrencyConfig } from '@deriv/hooks';
import { formatMoney } from '@deriv/shared';
import { observer, useStore } from '@deriv/stores';
import { Localize, localize } from '@deriv/translations';
import { useDevice } from '@deriv-com/ui';
import './deposit-crypto-disclaimers.scss';

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

const DepositCryptoDisclaimers: React.FC = observer(() => {
    const { client } = useStore();
    const { currency } = client;
    const { isMobile } = useDevice();
    const { data: crypto_config } = useCryptoConfig(currency);

    const currency_config = useCurrentCurrencyConfig();

    const minimum_deposit_disclaimer = currency_config?.is_tUSDT ? (
        <Localize
            i18n_default_text='A minimum deposit value of <0>{{minimum_deposit}}</0> {{currency}} is required. Otherwise, a fee is applied.'
            values={{
                minimum_deposit: formatMoney(currency_config.code, crypto_config?.minimum_deposit ?? 0, true),
                currency: currency_config.display_code,
            }}
            components={[<strong key={0} />]}
        />
    ) : (
        <Localize
            i18n_default_text='A minimum deposit value of <0>{{minimum_deposit}}</0> {{currency}} is required. Otherwise, the funds will be lost and cannot be recovered.'
            values={{
                minimum_deposit: formatMoney(currency_config?.code, crypto_config?.minimum_deposit ?? 0, true),
                currency: currency_config?.display_code,
            }}
            components={[<strong key={0} />]}
        />
    );

    return (
        <div className='deposit-crypto-disclaimers'>
            <InlineMessage title={localize('To avoid loss of funds:')}>
                <br />
                <ul className='deposit-crypto-disclaimers__list'>
                    {crypto_config?.minimum_deposit && <li>{minimum_deposit_disclaimer}</li>}
                    <li>
                        <Localize
                            i18n_default_text='Only send {{currency_name}} ({{currency_code}}) to this address.'
                            values={{
                                currency_name: currency_config?.name || '',
                                currency_code: currency_config?.display_code || '',
                            }}
                        />
                    </li>
                    <li>
                        <Localize
                            i18n_default_text='Make sure to copy the Deriv {{currency}} Wallet address to your crypto wallet.'
                            values={{ currency }}
                        />
                    </li>
                    <li>
                        <Localize
                            i18n_default_text='In your crypto wallet, select the <0>{{network_name}} network</0> when transferring to Deriv. Incorrect transfers may result in the loss of funds.'
                            values={{ network_name: crypto_currency_to_network_mapper[currency_config?.code] }}
                            components={[<strong key={0} />]}
                        />
                    </li>
                </ul>
            </InlineMessage>
            <Text align='center' size={isMobile ? 'xxxs' : 'xxs'}>
                <Localize
                    i18n_default_text='<0>Note:</0> You’ll receive an email when your deposit starts being processed.'
                    components={[<Text key={0} size={isMobile ? 'xxxs' : 'xxs'} weight='bold' />]}
                />
            </Text>
        </div>
    );
});

export default DepositCryptoDisclaimers;
