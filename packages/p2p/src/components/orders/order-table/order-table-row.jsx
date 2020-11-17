import { Table } from '@deriv/components';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import { observer } from 'mobx-react-lite';
import { localize, Localize } from 'Components/i18next';
import Dp2pContext from 'Components/context/dp2p-context';
import { secondsToTimer } from 'Utils/date-time';
import { createExtendedOrderDetails } from 'Utils/orders';
import ServerTime from 'Utils/server-time';
import { useStores } from 'Stores';

const OrderRow = observer(({ row: order, onOpenDetails, is_active }) => {
    const { general_store } = useStores();
    const [order_state, setOrderState] = React.useState(order); // Use separate state to force refresh when (FE-)expired.
    const [remaining_time, setRemainingTime] = React.useState();
    const { getLocalStorageSettingsForLoginId } = React.useContext(Dp2pContext);
    const interval = React.useRef(null);

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

    const isOrderSeen = order_id => {
        const { notifications } = getLocalStorageSettingsForLoginId();
        return notifications.some(notification => notification.order_id === order_id && notification.is_seen === true);
    };

    React.useEffect(() => {
        const countDownTimer = () => {
            const distance = ServerTime.getDistanceToServerTime(order_expiry_milliseconds);
            const timer = secondsToTimer(distance);

            if (distance < 1) {
                const { client, props } = general_store;
                setRemainingTime(localize('expired'));
                setOrderState(createExtendedOrderDetails(order.order_details, client.loginid, props.server_time));
                clearInterval(interval.current);
            } else {
                setRemainingTime(timer);
            }
        };

        interval.current = setInterval(countDownTimer, 1000);
        return () => clearInterval(interval.current);
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    const offer_amount = `${amount_display} ${account_currency}`;
    const transaction_amount = `${price_display} ${local_currency}`;

    return (
        <div onClick={() => onOpenDetails(order)}>
            <Table.Row
                className={classNames('orders__table-row orders__table-grid', {
                    'orders__table-grid--active': is_active,
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
                    {is_active ? <div className='orders__table-time'>{remaining_time}</div> : order_purchase_datetime}
                </Table.Cell>
            </Table.Row>
        </div>
    );
});

OrderRow.displayName = 'OrderRow';
OrderRow.propTypes = {
    data: PropTypes.shape({
        account_currency: PropTypes.string,
        amount_display: PropTypes.string,
        display_status: PropTypes.string,
        id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        is_buy_order: PropTypes.bool,
        local_currency: PropTypes.string,
        order_purchase_datetime: PropTypes.string,
        price_display: PropTypes.string,
    }),
    onOpenDetails: PropTypes.func,
    style: PropTypes.object,
};

export default OrderRow;
