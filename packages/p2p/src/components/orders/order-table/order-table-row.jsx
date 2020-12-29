import { Table } from '@deriv/components';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import { observer } from 'mobx-react-lite';
import { localize, Localize } from 'Components/i18next';
import { secondsToTimer } from 'Utils/date-time';
import { createExtendedOrderDetails } from 'Utils/orders';
import ServerTime from 'Utils/server-time';
import { useStores } from 'Stores';

const OrderRow = observer(({ row: order }) => {
    const getTimeLeft = time => {
        const distance = ServerTime.getDistanceToServerTime(time);
        return {
            distance,
            label: distance < 0 ? localize('expired') : secondsToTimer(distance),
        };
    };

    const { general_store, order_store } = useStores();
    const [order_state, setOrderState] = React.useState(order); // Use separate state to force refresh when (FE-)expired.
    const {
        account_currency,
        amount_display,
        id,
        is_buy_order,
        is_my_ad,
        is_sell_order,
        local_currency,
        order_expiry_milliseconds,
        order_purchase_datetime,
        other_user_details,
        price_display,
        should_highlight_alert,
        should_highlight_danger,
        should_highlight_disabled,
        should_highlight_success,
        status_string,
    } = order_state;

    const [remaining_time, setRemainingTime] = React.useState(getTimeLeft(order_expiry_milliseconds).label);

    const interval = React.useRef(null);

    const isOrderSeen = order_id => {
        const { notifications } = general_store.getLocalStorageSettingsForLoginId();
        return notifications.some(notification => notification.order_id === order_id && notification.is_seen === true);
    };

    React.useEffect(() => {
        const countDownTimer = () => {
            const { distance, label } = getTimeLeft(order_expiry_milliseconds);

            if (distance < 0) {
                const { client, props } = general_store;
                setRemainingTime(label);
                setOrderState(createExtendedOrderDetails(order.order_details, client.loginid, props.server_time));
                clearInterval(interval.current);
            } else {
                setRemainingTime(label);
            }
        };

        interval.current = setInterval(countDownTimer, 1000);
        return () => clearInterval(interval.current);
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    const offer_amount = `${amount_display} ${account_currency}`;
    const transaction_amount = `${price_display} ${local_currency}`;

    return (
        <div onClick={() => order_store.setQueryDetails(order)}>
            <Table.Row
                className={classNames('orders__table-row orders__table-grid', {
                    'orders__table-grid--active': general_store.is_active_tab,
                    'orders__table-row--attention': !isOrderSeen(id),
                })}
            >
                <Table.Cell>
                    {(is_buy_order && !is_my_ad) || (is_sell_order && is_my_ad) ? (
                        <Localize i18n_default_text='Buy' />
                    ) : (
                        <Localize i18n_default_text='Sell' />
                    )}
                </Table.Cell>
                <Table.Cell>{id}</Table.Cell>
                <Table.Cell>{other_user_details.name}</Table.Cell>
                <Table.Cell>
                    <div
                        className={classNames('orders__table-status', {
                            'orders__table-status--danger': should_highlight_danger,
                            'orders__table-status--alert': should_highlight_alert,
                            'orders__table-status--success': should_highlight_success,
                            'orders__table-status--disabled': should_highlight_disabled,
                        })}
                    >
                        {status_string}
                    </div>
                </Table.Cell>
                <Table.Cell>
                    {(is_buy_order && !is_my_ad) || (is_sell_order && is_my_ad) ? transaction_amount : offer_amount}
                </Table.Cell>
                <Table.Cell>
                    {(is_buy_order && !is_my_ad) || (is_sell_order && is_my_ad) ? offer_amount : transaction_amount}
                </Table.Cell>
                <Table.Cell>
                    {general_store.is_active_tab ? (
                        <div className='orders__table-time'>{remaining_time}</div>
                    ) : (
                        order_purchase_datetime
                    )}
                </Table.Cell>
            </Table.Row>
        </div>
    );
});

OrderRow.displayName = 'OrderRow';
OrderRow.propTypes = {
    order: PropTypes.object,
};

export default OrderRow;
