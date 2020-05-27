import classNames from 'classnames';
import React from 'react';
import PropTypes from 'prop-types';
import { localize } from 'Components/i18next';

const OrderDetailsStatusBlock = ({ order_details }) => {
    const {
        is_buyer,
        is_buyer_cancelled,
        is_buyer_confirmed,
        is_completed,
        is_expired,
        is_pending,
        is_refunded,
    } = order_details;

    return (
        <h2
            className={classNames('order-details__header-status order-details__header-status--info', {
                'order-details__header-status--danger': (is_buyer && is_pending) || (!is_buyer && is_buyer_confirmed),
                'order-details__header-status--alert': (is_buyer && is_buyer_confirmed) || (!is_buyer && is_pending),
                'order-details__header-status--success': is_completed,
            })}
        >
            {is_pending && is_buyer && localize('Pay now')}
            {is_pending && !is_buyer && localize('Wait for payment')}
            {is_buyer_cancelled && localize('Cancelled')}
            {is_refunded && is_buyer && localize('You have been refunded')}
            {is_refunded && !is_buyer && localize('Buyer has been refunded')}
            {is_buyer_confirmed && is_buyer && localize('Wait for release')}
            {is_buyer_confirmed && !is_buyer && localize('Confirm payment')}
            {is_expired && localize('Expired')}
            {is_completed && localize('Completed')}
        </h2>
    );
};

OrderDetailsStatusBlock.propTypes = {
    order_details: PropTypes.object,
};

export default OrderDetailsStatusBlock;
