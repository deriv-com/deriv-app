import React                  from 'react';
import PropTypes              from 'prop-types';
import { localize }           from 'Components/i18next';
import { secondsToTimer }     from 'Utils/date-time';
import ServerTime             from 'Utils/server-time';

const OrderDetailsTimerBlock = ({ order_details }) => {
    const [remaining_time, setRemainingTime] = React.useState();
    let interval;

    const countDownTimer = () => {
        const distance = ServerTime.getDistanceToServerTime(order_details.order_expiry_millis);
        const timer = secondsToTimer(distance);

        if (distance < 0) {
            setRemainingTime(localize('expired'));
            if (interval) clearInterval(interval);
        } else {
            setRemainingTime(timer);
        }
    };

    React.useEffect(() => {
        countDownTimer();
        interval = setInterval(countDownTimer, 1000);

        return () => {
            clearInterval(interval);
        };
    }, []);

    return (order_details.is_pending || order_details.is_buyer_confirmed) ? (
        <div className='order-details__header-timer'>
            <p>{localize('Time left')}</p>
            <p className='order-details__header-timer-counter'>
                { remaining_time }
            </p>
        </div>
    ) : null;
};

OrderDetailsTimerBlock.propTypes = {
    order_details: PropTypes.object,
};

export default OrderDetailsTimerBlock;
