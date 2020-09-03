import { Table } from '@deriv/components';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import { localize } from 'Components/i18next';
import Dp2pContext from 'Components/context/dp2p-context';
import { secondsToTimer } from 'Utils/date-time';
import ServerTime from 'Utils/server-time';

const OrderRowComponent = React.memo(({ advert, onOpenDetails, style, is_active }) => {
    const {
        account_currency,
        amount_display,
        id,
        is_buy_ad,
        is_buyer_cancelled_order,
        is_buyer_confirmed_order,
        is_completed_order,
        is_expired_order,
        is_pending_order,
        is_refunded_order,
        local_currency,
        order_expiry_milliseconds,
        order_purchase_datetime,
        other_user_details,
        price_display,
        status_string,
    } = advert;
    const [remaining_time, setRemainingTime] = React.useState();
    const { getLocalStorageSettingsForLoginId } = React.useContext(Dp2pContext);

    let interval;

    const isOrderSeen = order_id => {
        const { notifications } = getLocalStorageSettingsForLoginId();
        return notifications.some(notification => notification.order_id === order_id && notification.is_seen === true);
    };

    const countDownTimer = () => {
        const distance = ServerTime.getDistanceToServerTime(order_expiry_milliseconds);
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

    const offer_amount = `${amount_display} ${account_currency}`;
    const transaction_amount = `${price_display} ${local_currency}`;

    return (
        <div onClick={() => onOpenDetails(advert)} style={style}>
            <Table.Row
                className={classNames('orders__table-row orders__table-grid', {
                    'orders__table-grid--active': is_active,
                    'orders__table-row--attention': !isOrderSeen(id),
                })}
            >
                <Table.Cell>{is_buy_ad ? localize('Buy') : localize('Sell')}</Table.Cell>
                <Table.Cell>{id}</Table.Cell>
                <Table.Cell>{other_user_details.name}</Table.Cell>
                <Table.Cell>
                    <div
                        className={classNames('orders__table-status', {
                            'orders__table-status--primary':
                                (is_buyer_confirmed_order && !is_buy_ad) || (is_buy_ad && is_pending_order),
                            'orders__table-status--secondary':
                                (!is_buy_ad && is_pending_order) || (is_buyer_confirmed_order && is_buy_ad),
                            'orders__table-status--success': is_completed_order,
                            // 'orders__table-status--info': is_refunded_order,
                            'orders__table-status--disabled':
                                is_buyer_cancelled_order || is_expired_order || is_refunded_order,
                        })}
                    >
                        {status_string}
                    </div>
                </Table.Cell>
                <Table.Cell>{is_buy_ad ? transaction_amount : offer_amount}</Table.Cell>
                <Table.Cell>{is_buy_ad ? offer_amount : transaction_amount}</Table.Cell>
                <Table.Cell>
                    {is_active ? <div className='orders__table-time'>{remaining_time}</div> : order_purchase_datetime}
                </Table.Cell>
            </Table.Row>
        </div>
    );
});

OrderRowComponent.propTypes = {
    data: PropTypes.shape({
        account_currency: PropTypes.string,
        amount_display: PropTypes.string,
        display_status: PropTypes.string,
        id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        is_buy_ad: PropTypes.bool,
        local_currency: PropTypes.string,
        order_purchase_datetime: PropTypes.string,
        price_display: PropTypes.string,
    }),
    onOpenDetails: PropTypes.func,
    style: PropTypes.object,
};

OrderRowComponent.displayName = 'OrderRowComponent';

export default OrderRowComponent;
