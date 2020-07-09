import React from 'react';
import PropTypes from 'prop-types';
import { ButtonToggle } from '@deriv/components';
import Dp2pContext from 'Components/context/dp2p-context';
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
    const { order_table_type, changeOrderToggle } = React.useContext(Dp2pContext);

    return (
        <>
            <div className='orders__header'>
                <ButtonToggle
                    buttons_arr={orders_filters}
                    className='orders__header-filter'
                    is_animated
                    name='filter'
                    onChange={({ target: { value } }) => changeOrderToggle(value)}
                    value={order_table_type}
                    has_rounded_button
                />
            </div>
            <OrderTableContent showDetails={showDetails} is_active={order_table_type === orderToggleIndex.ACTIVE} />
        </>
    );
};

OrderTable.propTypes = {
    showDetails: PropTypes.func,
};

export default OrderTable;
