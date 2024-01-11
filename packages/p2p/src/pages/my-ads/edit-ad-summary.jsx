import React from 'react';
import PropTypes from 'prop-types';
import { formatMoney } from '@deriv/shared';
import { observer, useStore } from '@deriv/stores';
import { Text } from '@deriv/components';
import { useP2PExchangeRate, useP2PSettings } from '@deriv/hooks';
import { buy_sell } from 'Constants/buy-sell';
import { Localize } from 'Components/i18next';
import { ad_type } from 'Constants/floating-rate';
import { useStores } from 'Stores';
import { removeTrailingZeros, roundOffDecimal, percentOf } from 'Utils/format-value';
import './edit-ad-summary.scss';

const EditAdSummary = ({ offer_amount, price_rate, type }) => {
    const {
        client: { currency, local_currency_config },
    } = useStore();
    const local_currency = local_currency_config.currency;
    const exchange_rate = useP2PExchangeRate(local_currency);

    const { my_ads_store } = useStores();
    const { p2p_settings } = useP2PSettings();
    const override_exchange_rate = p2p_settings?.override_exchange_rate;
    const market_rate = override_exchange_rate ? Number(override_exchange_rate) : exchange_rate;

    const display_offer_amount = offer_amount ? formatMoney(currency, offer_amount, true) : '';
    const market_feed = my_ads_store.required_ad_type === ad_type.FLOAT ? market_rate : null;

    let display_price_rate = '';
    let display_total = '';

    if (price_rate) {
        display_price_rate = market_feed ? roundOffDecimal(percentOf(market_feed, price_rate), 6) : price_rate;
    }

    if (offer_amount && price_rate) {
        display_total = market_feed
            ? formatMoney(local_currency, offer_amount * display_price_rate, true)
            : formatMoney(local_currency, offer_amount * price_rate, true);
    }

    if (offer_amount) {
        const components = [
            <Text key={0} className='edit-ad-summary' weight='bold' size='xs' color='status-info-blue' />,
            <Text key={1} className='edit-ad-summary' size='xs' color='status-info-blue' />,
        ];
        const values = { target_amount: display_offer_amount, target_currency: currency };

        if (price_rate) {
            Object.assign(values, {
                local_amount: display_total,
                local_currency,
                price_rate: removeTrailingZeros(formatMoney(local_currency, display_price_rate, true, 6)),
            });

            if (type === buy_sell.BUY) {
                return (
                    <Text key={0} className='edit-ad-summary' size='xs' color='less-prominent'>
                        <Localize
                            i18n_default_text="You're editing an ad to buy <0>{{ target_amount }} {{ target_currency }}</0> for <0>{{ local_amount }} {{ local_currency }}</0> <1>({{ price_rate }} {{local_currency}}/{{ target_currency }})</1>"
                            components={components}
                            values={values}
                        />
                    </Text>
                );
            }

            return (
                <Text key={0} className='edit-ad-summary' size='xs' color='less-prominent'>
                    <Localize
                        i18n_default_text="You're editing an ad to sell <0>{{ target_amount }} {{ target_currency }}</0> for <0>{{ local_amount }} {{ local_currency }}</0> <1>({{ price_rate }} {{local_currency}}/{{ target_currency }})</1>"
                        components={components}
                        values={values}
                    />
                </Text>
            );
        }

        if (type === buy_sell.BUY) {
            return (
                <Text key={0} className='edit-ad-summary' size='xs' color='less-prominent'>
                    <Localize
                        i18n_default_text="You're editing an ad to buy <0>{{ target_amount }} {{ target_currency }}</0>..."
                        components={components}
                        values={values}
                    />
                </Text>
            );
        }

        return (
            <Text key={0} className='edit-ad-summary' size='xs' color='less-prominent'>
                <Localize
                    i18n_default_text="You're editing an ad to sell <0>{{ target_amount }} {{ target_currency }}</0>..."
                    components={components}
                    values={values}
                />
            </Text>
        );
    }

    return type === buy_sell.BUY ? (
        <Text key={0} className='edit-ad-summary' size='xs' color='less-prominent'>
            <Localize i18n_default_text="You're editing an ad to buy..." />
        </Text>
    ) : (
        <Text key={0} className='edit-ad-summary' size='xs' color='less-prominent'>
            <Localize i18n_default_text="You're editing an ad to sell..." />
        </Text>
    );
};

EditAdSummary.propTypes = {
    offer_amount: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    price_rate: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    market_feed: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    type: PropTypes.string,
};

export default observer(EditAdSummary);
