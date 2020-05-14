import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { ButtonToggle } from '@deriv/components';
import { localize } from 'Components/i18next';
import Dp2pContext from 'Components/context/dp2p-context';
import OrderTableContent from './order-table-content.jsx';
import { orderToggleIndex } from '../order-info';

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
    const { order_active_index, changeOrderToggle } = useContext(Dp2pContext);

    return (
        <>
            <div className='orders__header'>
                <ButtonToggle
                    buttons_arr={orders_filters}
                    className='orders__header-filter'
                    is_animated
                    name='filter'
                    onChange={({ target: { value } }) => changeOrderToggle(value)}
                    value={order_active_index}
                    rounded_button
                />
            </div>
            <OrderTableContent showDetails={showDetails} is_active={order_active_index === orderToggleIndex.ACTIVE} />
        </>
    );
};

OrderTable.propTypes = {
    showDetails: PropTypes.func,
};

export default OrderTable;
