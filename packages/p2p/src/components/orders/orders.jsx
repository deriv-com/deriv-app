import React from 'react';
import { useSafeState } from '@deriv/components';
import { reaction } from 'mobx';
import { observer } from '@deriv/stores';
import OrderDetails from 'Components/order-details/order-details.jsx';
import { useStores } from 'Stores';
import OrderTable from './order-table/order-table.jsx';
import Dp2pBlocked from 'Components/dp2p-blocked';
import './orders.scss';

const Orders = observer(() => {
    const { general_store, order_store } = useStores();

    // This is a bit hacky, but it allows us to force re-render this
    // component when the timer expired. This is created due to BE
    // not expiring orders on time. Remove this when they do.
    const [, forceRerender] = useSafeState();
    order_store.setForceRerenderOrders(forceRerender);

    React.useEffect(() => {
        const disposeOrderIdReaction = reaction(
            () => order_store.order_id,
            () => {
                // DO NOT REMOVE. This fixes all P2P order routing issues
                order_store.onOrderIdUpdate();
            },
            { fireImmediately: true }
        );

        const disposeOrdersUpdateReaction = reaction(
            () => order_store.orders,
            () => order_store.onOrdersUpdate(),
            { fireImmediately: true }
        );

        return () => {
            disposeOrderIdReaction();
            disposeOrdersUpdateReaction();
            order_store.onUnmount();
        };

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    if (general_store.should_show_dp2p_blocked) {
        return <Dp2pBlocked />;
    }

    if (order_store.order_information) {
        return (
            <div className='orders'>
                <OrderDetails />
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
