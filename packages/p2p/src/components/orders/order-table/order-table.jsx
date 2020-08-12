import React from 'react';
import PropTypes from 'prop-types';
import { ButtonToggle } from '@deriv/components';
import Dp2pContext from 'Components/context/dp2p-context';
import { localize } from 'Components/i18next';
import OrderTableContent from './order-table-content.jsx';
import { orderToggleIndex } from '../order-info';

const OrderTable = ({ showDetails }) => {
    const { LocalStorage, changeOrderToggle, order_table_type } = React.useContext(Dp2pContext);
    const getOrderFilters = () => [
        {
            text: localize('Active order'),
            value: orderToggleIndex.ACTIVE,
            count: LocalStorage.getActiveNotificationCount(true),
        },
        {
            text: localize('Past order'),
            value: orderToggleIndex.INACTIVE,
            count: LocalStorage.getActiveNotificationCount(false),
        },
    ];

    const is_active_tab = order_table_type === orderToggleIndex.ACTIVE;
    return (
        <>
            <div className='orders__header'>
                <ButtonToggle
                    buttons_arr={getOrderFilters()}
                    className='orders__header-filter'
                    is_animated
                    name='filter'
                    onChange={({ target: { value } }) => changeOrderToggle(value)}
                    value={order_table_type}
                    has_rounded_button
                />
            </div>
            <OrderTableContent showDetails={showDetails} is_active={is_active_tab} />
        </>
    );
};

OrderTable.propTypes = {
    showDetails: PropTypes.func,
};

export default OrderTable;
