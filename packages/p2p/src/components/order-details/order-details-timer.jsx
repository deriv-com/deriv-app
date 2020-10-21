import React from 'react';
import { observer } from 'mobx-react-lite';
import { localize } from 'Components/i18next';
import { useStores } from 'Stores';

const OrderDetailsTimer = observer(() => {
    const { order_store, order_details_store } = useStores();

    const { should_show_order_timer } = order_store.order_information;

    React.useEffect(() => {
        order_details_store.onMountTimer();
        return () => order_details_store.clearIntervalState();
    }, []);

    if (should_show_order_timer) {
        return (
            <div className='order-details__header-timer'>
                <div>{localize('Time left')}</div>
                <div className='order-details__header-timer-counter'>{order_details_store.remaining_time}</div>
            </div>
        );
    }

    order_details_store.clearIntervalState();
    return null;
});

export default OrderDetailsTimer;
