import React from 'react';
import PropTypes from 'prop-types';

const OrderDetailsAmountBlock = ({ order_details }) =>
    order_details.is_pending || order_details.is_buyer_confirmed ? (
        <h1 className='order-details__header-amount'>
            {`${order_details.display_transaction_amount} ${order_details.transaction_currency}`}
        </h1>
    ) : null;

OrderDetailsAmountBlock.propTypes = {
    order_details: PropTypes.object,
};

export default OrderDetailsAmountBlock;
