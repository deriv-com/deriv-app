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
            className={classNames('order-details__header-status', {
                'order-details__header-status--wait-for-payment': is_pending && !is_buyer,
                'order-details__header-status--expired': is_expired,
            })}
        >
            {is_pending && is_buyer && localize('Please pay')}
            {is_pending && !is_buyer && localize('Wait for payment')}
            {is_buyer_cancelled && is_buyer && localize('You have cancelled this order')}
            {is_buyer_cancelled && !is_buyer && localize('Buyer has cancelled this order')}
            {is_refunded && is_buyer && localize('You have been refunded')}
            {is_refunded && !is_buyer && localize('Buyer has been refunded')}
            {is_buyer_confirmed && is_buyer && localize('Wait for release')}
            {is_buyer_confirmed && !is_buyer && localize('Confirm payment')}
            {is_expired && localize('Expired')}
            {is_completed && localize('Order complete')}
        </h2>
    );
};

OrderDetailsStatusBlock.propTypes = {
    order_details: PropTypes.object,
};

export default OrderDetailsStatusBlock;
