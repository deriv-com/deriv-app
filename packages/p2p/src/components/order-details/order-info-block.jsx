import React from 'react';
import PropTypes from 'prop-types';
import { Text } from '@deriv/components';
import classNames from 'classnames';

const OrderInfoBlock = ({ className, label, value }) => (
    <div className={classNames('order-details-card__info-block', className)}>
        <Text as='p' color='less-prominent' size='xxs'>
            {label}
        </Text>
        <div className='order-details-card__info-block-value'>{value}</div>
    </div>
);

OrderInfoBlock.propTypes = {
    label: PropTypes.string,
    value: PropTypes.any,
};

export default OrderInfoBlock;
