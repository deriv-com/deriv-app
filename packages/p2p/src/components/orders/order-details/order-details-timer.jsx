import React from 'react';
import PropTypes from 'prop-types';
import { localize } from 'Components/i18next';
import { secondsToTimer } from 'Utils/date-time';
import ServerTime from 'Utils/server-time';

const OrderDetailsTimer = ({ order_information }) => {
    const [remaining_time, setRemainingTime] = React.useState();
    const { is_pending_order, is_buyer_confirmed_order } = order_information;

    let interval;

    const countDownTimer = () => {
        const distance = ServerTime.getDistanceToServerTime(order_information.order_expiry_milliseconds);
        const timer = secondsToTimer(distance);

        if (distance < 0) {
            setRemainingTime(localize('expired'));
            clearInterval(interval);
        } else {
            setRemainingTime(timer);
        }
    };

    React.useEffect(() => {
        countDownTimer();
        interval = setInterval(countDownTimer, 1000);
        return () => clearInterval(interval);
    }, []);

    if (is_pending_order || is_buyer_confirmed_order) {
        return (
            <div className='order-details__header-timer'>
                <div>{localize('Time left')}</div>
                <div className='order-details__header-timer-counter'>{remaining_time}</div>
            </div>
        );
    }

    return null;
};

OrderDetailsTimer.propTypes = {
    order_information: PropTypes.object,
};

export default OrderDetailsTimer;
