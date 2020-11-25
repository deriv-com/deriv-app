import React from 'react';
import PropTypes from 'prop-types';
import { formatMoney } from '@deriv/shared';
import { Localize } from 'Components/i18next';
import { buy_sell } from '../../constants/buy-sell';

const AdSummary = ({ offer_amount, offer_currency, price_rate, transaction_currency, type }) => {
    const display_offer_amount = offer_amount ? formatMoney(offer_currency, offer_amount, true) : '';
    const display_price_rate = price_rate ? formatMoney(transaction_currency, price_rate, true) : '';
    const display_total =
        offer_amount && price_rate ? formatMoney(transaction_currency, offer_amount * price_rate, true) : '';

    if (offer_amount) {
        const components = [<span key={0} className='p2p-my-ads__form-summary--bold' />];
        const values = { target_amount: display_offer_amount, target_currency: offer_currency };

        if (price_rate) {
            Object.assign(values, {
                local_amount: display_total,
                local_currency: transaction_currency,
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
};

AdSummary.propTypes = {
    offer_amount: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    offer_currency: PropTypes.string,
    price_rate: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    transaction_currency: PropTypes.string,
    type: PropTypes.string,
};

export default AdSummary;
