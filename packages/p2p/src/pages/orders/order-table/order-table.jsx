import React from 'react';
import PropTypes from 'prop-types';
import { ButtonToggle } from '@deriv/components';
import { observer } from 'mobx-react-lite';
import { localize } from 'Components/i18next';
import ToggleContainer from 'Components/toggle-container';
import CompositeCalendar from 'Components/composite-calendar';
import { order_list } from 'Constants/order-list';
import { useStores } from 'Stores';
import OrderTableContent from './order-table-content.jsx';
import './order-table.scss';

const OrderTable = ({ showDetails }) => {
    const { general_store, order_store } = useStores();
    const { date_from, date_to, filtered_date_range, handleDateChange } = order_store;

    const orders_list_filters = [
        {
            text: localize('Active orders'),
            value: order_list.ACTIVE,
            count: general_store.active_notification_count,
        },
        {
            text: localize('Past orders'),
            value: order_list.INACTIVE,
            count: general_store.inactive_notification_count,
        },
    ];

    const is_active_tab = general_store.order_table_type === order_list.ACTIVE;
    return (
        <React.Fragment>
            <div className='order-table'>
                <div className='order-table__toggle-wrapper '>
                    <ToggleContainer>
                        <ButtonToggle
                            buttons_arr={orders_list_filters}
                            className='order-table__toggle-wrapper-filter'
                            is_animated
                            name='filter'
                            onChange={({ target: { value } }) => general_store.setOrderTableType(value)}
                            value={general_store.order_table_type}
                            has_rounded_button
                        />
                    </ToggleContainer>
                    {!is_active_tab && (
                        <div className='order-table__toggle-wrapper--search'>
                            <CompositeCalendar
                                input_date_range={filtered_date_range}
                                onChange={handleDateChange}
                                from={date_from}
                                to={date_to}
                            />
                        </div>
                    )}
                </div>
            </div>
            <OrderTableContent showDetails={showDetails} is_active={is_active_tab} />
        </React.Fragment>
    );
};

OrderTable.propTypes = {
    showDetails: PropTypes.func,
};

export default observer(OrderTable);
