import React from 'react';
import PropTypes from 'prop-types';
import { ButtonToggle } from '@deriv/components';
import { observer } from 'mobx-react-lite';
import { localize } from 'Components/i18next';
import ToggleContainer from 'Components/misc/toggle-container.jsx';
import { order_list } from 'Constants/order-list';
import { useStores } from 'Stores';
import OrderTableContent from './order-table-content.jsx';

const OrderTable = observer(({ showDetails }) => {
    const { general_store } = useStores();

    const orders_list_filters = [
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

    const is_active_tab = general_store.order_table_type === order_list.ACTIVE;
    return (
        <React.Fragment>
            <div className='orders__header'>
                <ToggleContainer>
                    <ButtonToggle
                        buttons_arr={orders_list_filters}
                        className='orders__header-filter'
                        is_animated
                        name='filter'
                        onChange={({ target: { value } }) => general_store.setOrderTableType(value)}
                        value={general_store.order_table_type}
                        has_rounded_button
                    />
                </ToggleContainer>
            </div>
            <OrderTableContent showDetails={showDetails} is_active={is_active_tab} />
        </React.Fragment>
    );
});

OrderTable.propTypes = {
    showDetails: PropTypes.func,
};

export default OrderTable;
