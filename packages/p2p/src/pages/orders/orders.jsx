import React from 'react';
import { useSafeState } from '@deriv/components';
import { reaction } from 'mobx';
import { observer } from '@deriv/stores';
import OrderDetails from 'Components/order-details/order-details.jsx';
import { useModalManagerContext } from 'Components/modal-manager/modal-manager-context';
import { useStores } from 'Stores';
import OrderTable from './order-table/order-table.jsx';

const Orders = observer(() => {
    const { order_store, general_store } = useStores();
    const { showModal } = useModalManagerContext();

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

        const disposeOrderVerificationReaction = reaction(
            () => order_store.verification_code,
            () => {
                if (order_store.action_param && order_store.verification_code) {
                    showModal({ key: 'LoadingModal', props: {} });
                    order_store.verifyEmailVerificationCode(order_store.action_param, order_store.verification_code);
                }
            },
            { fireImmediately: true }
        );

        return () => {
            disposeOrderIdReaction();
            disposeOrdersUpdateReaction();
            disposeOrderVerificationReaction();
            order_store.onUnmount();
        };

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

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
