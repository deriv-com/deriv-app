import React from 'react';
import { useFetch } from '@deriv/api';
import { InlineMessage, Text } from '@deriv/components';
import { observer, useStore } from '@deriv/stores';
import { Localize, localize } from '@deriv/translations';
import './deposit-crypto-disclaimers.scss';

const crypto_currency_to_network_mapper: Record<string, string> = {
    BTC: 'Bitcoin (BTC)',
    ETH: 'Ethereum (ETH)',
    LTC: 'Litecoin (LTC)',
    USDC: 'Ethereum (ERC20)',
    UST: 'Omnicore',
    eUSDT: 'Ethereum (ERC20) ',
};

const DepositCryptoDisclaimers: React.FC = observer(() => {
    const { client, ui } = useStore();
    const { currency } = client;
    const { is_mobile } = ui;
    const { data } = useFetch('crypto_config');
    const minimum_deposit = data?.currencies_config[currency]?.minimum_deposit;

    return (
        <div className='deposit-crypto-disclaimers'>
            <InlineMessage title={localize('To avoid loss of funds:')}>
                <br />
                {minimum_deposit && (
                    <li>
                        <Text size={'xxxs'}>
                            <Localize
                                i18n_default_text='A minimum deposit value of <0>{{minimum_deposit}} {{currency}}</0> is required. Otherwise, the funds will be lost and cannot be recovered.'
                                values={{ minimum_deposit, currency }}
                                components={[<Text key={0} size={'xxxs'} weight='bold' />]}
                            />
                        </Text>
                    </li>
                )}
                <li>
                    <Text size={'xxxs'}>{localize('Do not send other currencies to this address.')}</Text>
                </li>
                <li>
                    <Text size={'xxxs'}>
                        {localize('Make sure to copy your Deriv account address correctly into your crypto wallet.')}
                    </Text>
                </li>
                <li>
                    <Text size={'xxxs'}>
                        <Localize
                            i18n_default_text='In your cryptocurrency wallet, make sure to select the <0>{{network_name}} network</0> when you transfer funds to Deriv.'
                            values={{ network_name: crypto_currency_to_network_mapper[currency] }}
                            components={[<Text key={0} size={'xxxs'} weight='bold' />]}
                        />
                    </Text>
                </li>
            </InlineMessage>
            <Text align='center' size={is_mobile ? 'xxxs' : 'xxs'}>
                <Localize
                    i18n_default_text='<0>Note:</0> You’ll receive an email when your deposit start being processed.'
                    components={[<Text key={0} size={is_mobile ? 'xxxs' : 'xxs'} weight='bold' />]}
                />
            </Text>
        </div>
    );
});

export default DepositCryptoDisclaimers;
