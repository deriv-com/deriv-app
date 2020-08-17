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

    const is_danger = (is_buyer && is_pending) || (!is_buyer && is_buyer_confirmed);
    const is_alert = (is_buyer && is_buyer_confirmed) || (!is_buyer && is_pending);

    let status;

    if (is_pending) {
        status = is_buyer ? localize('Pay now') : localize('Wait for payment');
    } else if (is_buyer_cancelled) {
        status = localize('Cancelled');
        // } else if (is_refunded) {
        //     status = is_buyer ? localize('Seller has been refunded') : localize('You have been refunded');
    } else if (is_buyer_confirmed) {
        status = is_buyer ? localize('Wait for release') : localize('Confirm payment');
    } else if (is_expired || is_refunded) {
        status = localize('Expired');
    } else if (is_completed) {
        status = localize('Completed');
    }

    return (
        <h2
            className={classNames('order-details__header-status order-details__header-status--info', {
                'order-details__header-status--danger': is_danger,
                'order-details__header-status--alert': is_alert,
                'order-details__header-status--success': is_completed,
            })}
        >
            {status}
        </h2>
    );
};

OrderDetailsStatusBlock.propTypes = {
    order_details: PropTypes.object,
};

export default OrderDetailsStatusBlock;
