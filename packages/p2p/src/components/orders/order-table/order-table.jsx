import React from 'react';
import PropTypes from 'prop-types';
import { ButtonToggle } from '@deriv/components';
import { localize } from 'Components/i18next';
import OrderTableContent from './order-table-content.jsx';
import { orderToggleIndex } from '../order-info';

const orders_filters = [
    {
        text: localize('Active order'),
        value: orderToggleIndex.ACTIVE,
    },
    {
        text: localize('Past order'),
        value: orderToggleIndex.INACTIVE,
    },
];

const OrderTable = ({ showDetails }) => {
    const [current_toggle, setCurrentToggle] = React.useState(orderToggleIndex.ACTIVE);
    return (
        <>
            <div className='orders__header'>
                <ButtonToggle
                    buttons_arr={orders_filters}
                    className='orders__header-filter'
                    is_animated
                    name='filter'
                    onChange={({ target: { value } }) => setCurrentToggle(value)}
                    value={current_toggle}
                    has_rounded_button
                />
            </div>
            <OrderTableContent showDetails={showDetails} is_active={current_toggle === orderToggleIndex.ACTIVE} />
        </>
    );
};

OrderTable.propTypes = {
    showDetails: PropTypes.func,
};

export default OrderTable;
