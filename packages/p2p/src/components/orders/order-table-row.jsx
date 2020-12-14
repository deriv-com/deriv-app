import { Table, Text, Icon } from '@deriv/components';
import { isMobile } from '@deriv/shared';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import { observer } from 'mobx-react-lite';
import { localize } from 'Components/i18next';
import { secondsToTimer } from 'Utils/date-time';
import ServerTime from 'Utils/server-time';
import { createExtendedOrderDetails } from 'Utils/orders';
import { useStores } from 'Stores';

const Title = ({
    is_buy_order_type_for_user,
    transaction_amount,
    offer_amount,
    order_purchase_datetime,
    order_type,
}) => {
    const send_amount = is_buy_order_type_for_user ? transaction_amount : offer_amount;
    return (
        <React.Fragment>
            <Text size='sm' line_height='xxs' weight='bold' as='p'>
                {order_type} {send_amount}
            </Text>
            <Text color='less-prominent' as='p' line_height='xxs' size='xxs' align='left'>
                {order_purchase_datetime}
            </Text>
        </React.Fragment>
    );
};

const OrderRowComponent = observer(({ style, data: order }) => {
    const { general_store, order_store, sendbird_store } = useStores();
    const [order_state, setOrderState] = React.useState(order); // Use separate state to force refresh when (FE-)expired.
    const [remaining_time, setRemainingTime] = React.useState();
    const [is_timer_visible, setIsTimerVisible] = React.useState();

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

    let interval;

    const isOrderSeen = order_id => {
        const { notifications } = general_store.getLocalStorageSettingsForLoginId();
        return notifications.some(notification => notification.order_id === order_id && notification.is_seen === true);
    };

    const countDownTimer = () => {
        const distance = ServerTime.getDistanceToServerTime(order_expiry_milliseconds);
        const timer = secondsToTimer(distance);

        if (distance < 1) {
            const { client, props } = general_store;
            setRemainingTime(localize('expired'));
            setOrderState(createExtendedOrderDetails(order.order_details, client.loginid, props.server_time));
            clearInterval(interval);
        } else {
            if (general_store.is_active_tab) {
                setIsTimerVisible(true);
            }
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
    const is_buy_order_type_for_user = (is_buy_order && !is_my_ad) || (is_sell_order && is_my_ad);
    const order_type = is_buy_order_type_for_user ? localize('Buy') : localize('Sell');

    return (
        <React.Fragment>
            {isMobile() ? (
                <div onClick={() => order_store.setQueryDetails(order)}>
                    <Table.Row
                        style={style}
                        className={classNames('orders__mobile', {
                            'orders__table-row--attention': !isOrderSeen(id),
                        })}
                    >
                        <Table.Cell
                            className={classNames('orders__mobile-header', {
                                'orders__table-grid--active': general_store.is_active_tab,
                            })}
                        >
                            <div
                                className={classNames('orders__mobile-status', {
                                    'orders__table-status--danger': should_highlight_danger,
                                    'orders__table-status--alert': should_highlight_alert,
                                    'orders__table-status--success': should_highlight_success,
                                    'orders__table-status--disabled': should_highlight_disabled,
                                })}
                            >
                                {status_string}
                            </div>
                        </Table.Cell>
                        <Table.Cell className='orders__mobile-header-right'>
                            {is_timer_visible && <div className='orders__mobile-time'>{remaining_time}</div>}
                            <div className='orders__mobile-chat'>
                                <Icon
                                    icon='IcChat'
                                    height={15}
                                    width={16}
                                    onClick={() => sendbird_store.setShouldShowChatModal(true)}
                                />
                            </div>
                        </Table.Cell>
                        <Table.Cell className='orders__mobile-title'>
                            <Title
                                is_buy_order_type_for_user={is_buy_order_type_for_user}
                                offer_amount={offer_amount}
                                order_purchase_datetime={order_purchase_datetime}
                                order_type={order_type}
                                transaction_amount={transaction_amount}
                            />
                        </Table.Cell>
                    </Table.Row>
                </div>
            ) : (
                <div onClick={() => order_store.setQueryDetails(order)} style={style}>
                    <Table.Row
                        className={classNames('orders__table-row orders__table-grid', {
                            'orders__table-grid--active': general_store.is_active_tab,
                            'orders__table-row--attention': !isOrderSeen(id),
                        })}
                    >
                        <Table.Cell>{order_type}</Table.Cell>
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
                        <Table.Cell>{is_buy_order_type_for_user ? transaction_amount : offer_amount}</Table.Cell>
                        <Table.Cell>{is_buy_order_type_for_user ? offer_amount : transaction_amount}</Table.Cell>
                        <Table.Cell>
                            {general_store.is_active_tab ? (
                                <div className='orders__table-time'>{remaining_time}</div>
                            ) : (
                                order_purchase_datetime
                            )}
                        </Table.Cell>
                    </Table.Row>
                </div>
            )}
        </React.Fragment>
    );
});

OrderRowComponent.propTypes = {
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
    getLocalStorageSettingsForLoginId: PropTypes.func,
    is_active_tab: PropTypes.bool,
    onOpenDetails: PropTypes.func,
    setQueryDetails: PropTypes.func,
    style: PropTypes.object,
};

OrderRowComponent.displayName = 'OrderRowComponent';

export default OrderRowComponent;
