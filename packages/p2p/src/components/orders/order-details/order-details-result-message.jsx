import React from 'react';
import PropTypes from 'prop-types';
import { localize } from 'Components/i18next';

const OrderDetailsResultMessage = ({ order_details }) => {
    const { is_completed, is_buyer, offer_currency, display_offer_amount } = order_details;

    if (is_completed) {
        return (
            <p className='order-details__wrapper-message order-details__wrapper-message--success'>
                {is_buyer
                    ? localize('{{offered_amount}} {{offered_currency}} was deposited on your account', {
                          offered_amount: display_offer_amount,
                          offered_currency: offer_currency,
                      })
                    : localize('You sold {{offered_amount}} {{offered_currency}}', {
                          offered_amount: display_offer_amount,
                          offered_currency: offer_currency,
                      })}
            </p>
        );
    }

    // TODO: [p2p-timeout-status-check] - Check if order has timed out and add timeout message
    return null;
};

OrderDetailsResultMessage.propTypes = {
    order_details: PropTypes.object,
};

export default OrderDetailsResultMessage;
