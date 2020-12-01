import React from 'react';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react-lite';
import { useStores } from 'Stores';
import OrderTable from './order-table.jsx';
import OrderDetails from '../order-details/order-details.jsx';
import './orders.scss';

const Orders = observer(() => {
    const { general_store, order_store } = useStores();
    const { order_information } = general_store;

    React.useEffect(() => {
        return () => order_store.onUnmount();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    React.useEffect(() => {
        order_store.onOrderIdUpdate();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [general_store.props.order_id]);

    React.useEffect(() => {
        order_store.onOrdersUpdate();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [general_store.orders]);

    if (order_information) {
        return (
            <div className='orders'>
                <OrderDetails onPageReturn={() => order_store.hideDetails(true)} />
            </div>
        );
    }

    return (
        <div className='orders'>
            <OrderTable />
        </div>
    );
});

Orders.propTypes = {
    navigate: PropTypes.func,
    params: PropTypes.object,
};

export default Orders;
