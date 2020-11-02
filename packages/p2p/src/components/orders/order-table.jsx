import React from 'react';
import PropTypes from 'prop-types';
import { ButtonToggle } from '@deriv/components';
import { observer } from 'mobx-react-lite';
import { useStores } from 'Stores';
import { localize } from 'Components/i18next';
import OrderTableContent from './order-table-content.jsx';
import { order_list } from '../../constants/order-list';

const OrderTable = observer(() => {
    const { general_store } = useStores();
    const order_list_filters = [
        {
            text: localize('Active order'),
            value: order_list.ACTIVE,
            count: general_store?.active_notification_count,
        },
        {
            text: localize('Past order'),
            value: order_list.INACTIVE,
            count: general_store?.inactive_notification_count,
        },
    ];
    return (
        <React.Fragment>
            <div className='orders__header'>
                <ButtonToggle
                    buttons_arr={order_list_filters}
                    className='orders__header-filter'
                    is_animated
                    name='filter'
                    onChange={({ target: { value } }) => general_store.setOrderTableType(value)}
                    value={general_store.order_table_type}
                    has_rounded_button
                />
            </div>
            <OrderTableContent />
        </React.Fragment>
    );
});

OrderTable.propTypes = {
    active_notification_count: PropTypes.number,
    inactive_notification_count: PropTypes.number,
    order_table_type: PropTypes.string,
    setOrderTableType: PropTypes.func,
};

export default OrderTable;
