import React from 'react';
import PropTypes from 'prop-types';
import { formatMoney } from '@deriv/shared';
import { observer } from 'mobx-react-lite';
import { Text } from '@deriv/components';
import { buy_sell } from 'Constants/buy-sell';
import { Localize } from 'Components/i18next';
import { ad_type } from 'Constants/floating-rate';
import { useStores } from 'Stores';
import { removeTrailingZeros, roundOffDecimal, percentOf } from 'Utils/format-value';

const EditAdSummary = ({ offer_amount, price_rate, type }) => {
    const { floating_rate_store, general_store, my_ads_store } = useStores();
    const { currency, local_currency_config } = general_store.client;
    const display_offer_amount = offer_amount ? formatMoney(currency, offer_amount, true) : '';
    const market_feed = my_ads_store.required_ad_type === ad_type.FLOAT ? floating_rate_store.market_rate : null;

    let display_price_rate = '';
    let display_total = '';

    if (price_rate) {
        display_price_rate = market_feed ? roundOffDecimal(percentOf(market_feed, price_rate), 6) : price_rate;
    }

    if (offer_amount && price_rate) {
        display_total = market_feed
            ? formatMoney(local_currency_config.currency, offer_amount * display_price_rate, true)
            : formatMoney(local_currency_config.currency, offer_amount * price_rate, true);
    }

    if (offer_amount) {
        const components = [
            <Text key={0} weight='bold' size='xs' color='status-info-blue' />,
            <Text key={1} weight='normal' size='xs' color='status-info-blue' />,
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
                    <Localize
                        i18n_default_text="You're editing an ad to buy <0>{{ target_amount }} {{ target_currency }}</0> for <0>{{ local_amount }} {{ local_currency }}</0> <1>({{ price_rate }} {{local_currency}}/{{ target_currency }})</1>"
                        components={components}
                        values={values}
                    />
                );
            }

            return (
                <Localize
                    i18n_default_text="You're editing an ad to sell <0>{{ target_amount }} {{ target_currency }}</0> for <0>{{ local_amount }} {{ local_currency }}</0> <1>({{ price_rate }} {{local_currency}}/{{ target_currency }})</1>"
                    components={components}
                    values={values}
                />
            );
        }

        if (type === buy_sell.BUY) {
            return (
                <Localize
                    i18n_default_text="You're editing an ad to buy <0>{{ target_amount }} {{ target_currency }}</0>..."
                    components={components}
                    values={values}
                />
            );
        }

        return (
            <Localize
                i18n_default_text="You're editing an ad to sell <0>{{ target_amount }} {{ target_currency }}</0>..."
                components={components}
                values={values}
            />
        );
    }

    return type === buy_sell.BUY ? (
        <Localize i18n_default_text="You're editing an ad to buy..." />
    ) : (
        <Localize i18n_default_text="You're editing an ad to sell..." />
    );
};

EditAdSummary.propTypes = {
    offer_amount: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    price_rate: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    market_feed: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    type: PropTypes.string,
};

export default observer(EditAdSummary);
