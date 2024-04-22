import React from 'react';
import { useSafeState } from '@deriv/components';
import { reaction } from 'mobx';
import { observer } from '@deriv/stores';
import OrderDetails from 'Components/order-details/order-details.jsx';
import { useStores } from 'Stores';
import OrderTable from './order-table/order-table.jsx';

const Orders = observer(() => {
    const { order_store, general_store } = useStores();
    const [code_param, setCodeParam] = React.useState(null);
    const [action_param, setActionParam] = React.useState(null);

    // This is a bit hacky, but it allows us to force re-render this
    // component when the timer expired. This is created due to BE
    // not expiring orders on time. Remove this when they do.
    const [, forceRerender] = useSafeState();
    order_store.setForceRerenderOrders(forceRerender);

    React.useEffect(() => {
        if (general_store.active_index !== 1) general_store.setActiveIndex(1);
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

    React.useEffect(() => {
        const url_params = new URLSearchParams(location.search);

        if (url_params.get('code')) setCodeParam(url_params.get('code'));
        if (url_params.get('action')) setActionParam(url_params.get('action'));
    }, []);

    React.useEffect(() => {
        if (action_param && code_param && typeof general_store.showModal === 'function') {
            general_store.showModal({ key: 'LoadingModal', props: {} });
            order_store.verifyEmailVerificationCode(action_param, code_param);
        }
    }, [action_param, code_param]);

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
