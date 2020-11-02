import React from 'react';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react-lite';
import { localize } from 'Components/i18next';
import { useStores } from 'Stores';

const OrderDetailsTimer = observer(() => {
    const { order_store, order_details_store } = useStores();

    const { should_show_order_timer } = order_store.order_information;

    React.useEffect(() => {
        order_details_store.countDownTimer();
        order_details_store.setIntervalState(setInterval(order_details_store.countDownTimer, 1000));
        return () => clearInterval(order_details_store.interval);
    }, []);

    if (should_show_order_timer) {
        return (
            <div className='order-details__header-timer'>
                <div>{localize('Time left')}</div>
                <div className='order-details__header-timer-counter'>{order_details_store.remaining_time}</div>
            </div>
        );
    }

    clearInterval(order_details_store.interval);
    return null;
});

OrderDetailsTimer.propTypes = {
    countDownTimer: PropTypes.func,
    order_information: PropTypes.object,
    setIntervalState: PropTypes.func,
};

export default OrderDetailsTimer;
