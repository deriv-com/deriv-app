import React from 'react';
import { Text } from '@deriv/components';
import { formatMoney } from '@deriv/shared';
import { observer, useStore } from '@deriv/stores';
import { Localize } from 'Components/i18next';
import { buy_sell } from 'Constants/buy-sell';
import { ad_type } from 'Constants/floating-rate';
import { useStores } from 'Stores';
import { removeTrailingZeros, roundOffDecimal, percentOf } from 'Utils/format-value';
import './create-ad-summary.scss';

type TCreateAdSummaryProps = {
    offer_amount: string;
    price_rate: string;
    type: string;
};

const CreateAdSummary = ({ offer_amount, price_rate, type }: TCreateAdSummaryProps) => {
    const {
        client: { currency, local_currency_config },
    } = useStore();

    const { floating_rate_store } = useStores();
    const { rate_type, market_rate } = floating_rate_store;

    const market_feed = rate_type === ad_type.FLOAT ? market_rate : null;
    const display_offer_amount = offer_amount ? formatMoney(currency, offer_amount, true) : '';

    let display_price_rate: string | number = '';
    let display_total = '';

    if (price_rate) {
        display_price_rate = market_feed ? roundOffDecimal(percentOf(market_feed, price_rate), 6) : price_rate;
    }

    if (offer_amount && price_rate) {
        display_total = market_feed
            ? formatMoney(local_currency_config.currency, Number(offer_amount) * Number(display_price_rate), true)
            : formatMoney(local_currency_config.currency, Number(offer_amount) * Number(price_rate), true);
    }

    if (offer_amount) {
        const components = [
            <Text key={0} className='create-ad-summary' weight='bold' size='xs' color='status-info-blue' />,
            <Text key={1} className='create-ad-summary' size='xs' color='status-info-blue' />,
        ];
        const values = { target_amount: display_offer_amount, target_currency: currency };
        if (price_rate) {
            Object.assign(values, {
                local_amount: display_total,
                local_currency: local_currency_config.currency,
                price_rate: removeTrailingZeros(
                    formatMoney(local_currency_config.currency, display_price_rate, true, 6)
                ),
            });

            if (type === buy_sell.BUY) {
                return (
                    <Text className='create-ad-summary' size='xs' color='less-prominent'>
                        <Localize
                            i18n_default_text="You're creating an ad to buy <0>{{ target_amount }} {{ target_currency }}</0> for <0>{{ local_amount }} {{ local_currency }}</0> <1>({{ price_rate }} {{local_currency}}/{{ target_currency }})</1>"
                            components={components}
                            values={values}
                        />
                    </Text>
                );
            }

            return (
                <Text className='create-ad-summary' size='xs' color='less-prominent'>
                    <Localize
                        i18n_default_text="You're creating an ad to sell <0>{{ target_amount }} {{ target_currency }}</0> for <0>{{ local_amount }} {{ local_currency }}</0> <1>({{ price_rate }} {{local_currency}}/{{ target_currency }})</1>"
                        components={components}
                        values={values}
                    />
                </Text>
            );
        }

        if (type === buy_sell.BUY) {
            return (
                <Text className='create-ad-summary' size='xs' color='less-prominent'>
                    <Localize
                        i18n_default_text="You're creating an ad to buy <0>{{ target_amount }} {{ target_currency }}</0>..."
                        components={components}
                        values={values}
                    />
                </Text>
            );
        }

        return (
            <Text className='create-ad-summary' size='xs' color='less-prominent'>
                <Localize
                    i18n_default_text="You're creating an ad to sell <0>{{ target_amount }} {{ target_currency }}</0>..."
                    components={components}
                    values={values}
                />
            </Text>
        );
    }

    return type === buy_sell.BUY ? (
        <Text className='create-ad-summary' size='xs' color='less-prominent'>
            <Localize i18n_default_text="You're creating an ad to buy..." />
        </Text>
    ) : (
        <Text className='create-ad-summary' size='xs' color='less-prominent'>
            <Localize i18n_default_text="You're creating an ad to sell..." />
        </Text>
    );
};

export default observer(CreateAdSummary);
