import React from 'react';
import { reaction } from 'mobx';
import { observer } from 'mobx-react-lite';
import OrderDetails from 'Components/order-details/order-details.jsx';
import { useStores } from 'Stores';
import OrderTable from './order-table/order-table.jsx';
import './orders.scss';

const Orders = observer(() => {
    const { general_store, order_store } = useStores();

    React.useEffect(() => {
        const disposeOrderIdReaction = reaction(
            () => general_store.props.order_id,
            () => order_store.onOrderUpdate()
        );

        const disposeOrdersUpdateReaction = reaction(
            () => order_store.orders,
            () => order_store.onOrdersUpdate()
        );

        return () => {
            disposeOrderIdReaction();
            disposeOrdersUpdateReaction();
            order_store.onUnmount();
        };

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    if (order_store.order_information) {
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

Orders.displayName = 'Orders';

export default Orders;
