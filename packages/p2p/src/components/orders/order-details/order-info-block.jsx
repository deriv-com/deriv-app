import React from 'react';
import PropTypes from 'prop-types';

const OrderInfoBlock = ({ label, value }) => (
    <div className='order-details__info-block'>
        <p className='order-details__info-block-label'>{label}</p>
        <div className='order-details__info-block-value'>{value}</div>
    </div>
);

OrderInfoBlock.propTypes = {
    label: PropTypes.string,
    value: PropTypes.string,
};

export default OrderInfoBlock;
