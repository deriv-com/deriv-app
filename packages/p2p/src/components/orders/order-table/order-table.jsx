import React from 'react';
import PropTypes from 'prop-types';
import { ButtonToggle } from '@deriv/components';
import { useStores } from 'Stores';
import { localize } from 'Components/i18next';
import OrderTableContent from './order-table-content.jsx';
import { orderToggleIndex } from '../order-info';

const OrderTable = ({ showDetails }) => {
    const { general_store } = useStores();
    const orders_filters = [
        {
            text: localize('Active order'),
            value: orderToggleIndex.ACTIVE,
            count: general_store.active_notification_count,
        },
        {
            text: localize('Past order'),
            value: orderToggleIndex.INACTIVE,
            count: general_store.inactive_notification_count,
        },
    ];

    const is_active_tab = general_store.order_table_type === orderToggleIndex.ACTIVE;
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
            <OrderTableContent showDetails={showDetails} is_active={is_active_tab} />
        </React.Fragment>
    );
};

OrderTable.propTypes = {
    showDetails: PropTypes.func,
};

export default OrderTable;
