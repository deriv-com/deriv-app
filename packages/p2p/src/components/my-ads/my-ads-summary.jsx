import React from 'react';
import PropTypes from 'prop-types';
import { formatMoney } from '@deriv/shared';
import { observer } from 'mobx-react-lite';
import { buy_sell } from 'Constants/buy-sell';
import { Localize } from 'Components/i18next';
import { useStores } from 'Stores';

const AdSummary = observer(({ offer_amount, price_rate, type }) => {
    const { general_store } = useStores();
    const { currency, local_currency_config } = general_store.client;

    const display_offer_amount = offer_amount ? formatMoney(currency, offer_amount, true) : '';
    const display_price_rate = price_rate ? formatMoney(local_currency_config.currency, price_rate, true) : '';
    const display_total =
        offer_amount && price_rate ? formatMoney(local_currency_config.currency, offer_amount * price_rate, true) : '';

    if (offer_amount) {
        const components = [<span key={0} className='p2p-my-ads__form-summary--bold' />];
        const values = { target_amount: display_offer_amount, target_currency: local_currency_config.currency };

        if (price_rate) {
            Object.assign(values, {
                local_amount: display_total,
                local_currency: currency,
                price_rate: display_price_rate,
            });

            if (type === buy_sell.BUY) {
                return (
                    <Localize
                        i18n_default_text="You're creating an ad to buy <0>{{ target_amount }} {{ target_currency }}</0> for <0>{{ local_amount }} {{ local_currency }}</0> ({{ price_rate }}/{{ target_currency }})"
                        components={components}
                        values={values}
                    />
                );
            }

            return (
                <Localize
                    i18n_default_text="You're creating an ad to sell <0>{{ target_amount }} {{ target_currency }}</0> for <0>{{ local_amount }} {{ local_currency }}</0> ({{ price_rate }}/{{ target_currency }})"
                    components={components}
                    values={values}
                />
            );
        }

        if (type === buy_sell.BUY) {
            return (
                <Localize
                    i18n_default_text="You're creating an ad to buy <0>{{ target_amount }} {{ target_currency }}</0>..."
                    components={components}
                    values={values}
                />
            );
        }

        return (
            <Localize
                i18n_default_text="You're creating an ad to sell <0>{{ target_amount }} {{ target_currency }}</0>..."
                components={components}
                values={values}
            />
        );
    }

    return type === buy_sell.BUY ? (
        <Localize i18n_default_text="You're creating an ad to buy..." />
    ) : (
        <Localize i18n_default_text="You're creating an ad to sell..." />
    );
});

AdSummary.propTypes = {
    client: PropTypes.object,
    offer_amount: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    price_rate: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    type: PropTypes.string,
};

export default AdSummary;
