import React from 'react';
import PropTypes from 'prop-types';
import { ButtonToggle } from '@deriv/components';
import { useStores } from 'Stores';
import { localize } from 'Components/i18next';
import OrderTableContent from './order-table-content.jsx';
import { order_list } from '../../../constants/order-list';

const OrderTable = ({ showDetails }) => {
    const { general_store } = useStores();
    const orders_filters = [
        {
            text: localize('Active order'),
            value: order_list.ACTIVE,
            count: general_store.active_notification_count,
        },
        {
            text: localize('Past order'),
            value: order_list.INACTIVE,
            count: general_store.inactive_notification_count,
        },
    ];

    return (
        <React.Fragment>
            <div className='orders__header'>
                <ButtonToggle
                    buttons_arr={orders_filters}
                    className='orders__header-filter'
                    is_animated
                    name='filter'
                    onChange={({ target: { value } }) => general_store.setOrderTableType(value)}
                    value={general_store.order_table_type}
                    has_rounded_button
                />
            </div>
            <OrderTableContent showDetails={showDetails} is_active={general_store.is_active_tab} />
        </React.Fragment>
    );
};

OrderTable.propTypes = {
    showDetails: PropTypes.func,
};

export default OrderTable;
