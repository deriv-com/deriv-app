import { Table } from '@deriv/components';
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { ButtonToggle } from '@deriv/components';
import { localize } from 'Components/i18next';
import OrderTableContent from './order-table-content.jsx';

const orders_filters = [
    {
        text: localize('Active order'),
        value: 'active',
    },
    {
        text: localize('Past order'),
        value: 'past',
    },
];

const OrderTable = ({ showDetails }) => {
    const [table_type, setTableType] = useState('active');

    return (
        <>
            <div className='orders__header'>
                <ButtonToggle
                    buttons_arr={orders_filters}
                    className='orders__header__filters'
                    is_animated
                    name='filter'
                    onChange={({ target: { value } }) => setTableType(value)}
                    value={table_type}
                />
            </div>
            <OrderTableContent showDetails={showDetails} is_active={table_type === 'active'} />
        </>
    );
};

OrderTable.propTypes = {
    orders: PropTypes.array,
    showDetails: PropTypes.func,
};

export default OrderTable;
