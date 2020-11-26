import { Table, ContentExpander, Text, Icon } from '@deriv/components';
import { isMobile } from '@deriv/shared';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import { observer } from 'mobx-react-lite';
import { localize, Localize } from 'Components/i18next';
import { secondsToTimer } from 'Utils/date-time';
import ServerTime from 'Utils/server-time';
import { createExtendedOrderDetails } from 'Utils/orders';
import { useStores } from 'Stores';

const OrderRowComponent = observer(({ data: order, style }) => {
    const { general_store, order_store } = useStores();
    const [order_state, setOrderState] = React.useState(order); // Use separate state to force refresh when (FE-)expired.
    const [remaining_time, setRemainingTime] = React.useState();
    const [is_timer_visible, setIsTimerVisible] = React.useState();
    const [remaining_time, setRemainingTime] = React.useState();

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
            setIsTimerVisible(true);
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
    const title = () => {
        const is_buy_order_type_for_user = (is_buy_order && !is_my_ad) || (is_sell_order && is_my_ad);
        const order_type = is_buy_order_type_for_user ? localize('Buy') : localize('Sell');
        const send = is_buy_order_type_for_user ? transaction_amount : offer_amount;
        return (
            <React.Fragment>
                <div className='orders__expander-content__title' as='p'>
                    <Text size='sm' weight='bold'>
                        {order_type} {send}
                    </Text>
                    <Text color='less-prominent' as='p' size='xxs'>
                        {order_purchase_datetime}
                    </Text>
                </div>
            </React.Fragment>
        );
    };
    return (
        <React.Fragment>
            {isMobile() ? (
                <div
                    style={style}
                    className={classNames('orders__expander', {
                        'orders__expander-heighlight-danger': should_highlight_danger,
                    })}
                >
                    <div className='orders__expander-top' onClick={() => onOpenDetails(order)}>
                        <Table.Row className='orders__expander-header'>
                            <Table.Cell
                                className={classNames('orders__table-row orders__expander-header', {
                                    'orders__table-grid--active': is_active,
                                })}
                            >
                                <div
                                    className={classNames('orders__expander-status', {
                                        'orders__table-status--danger': should_highlight_danger,
                                        'orders__table-status--alert': should_highlight_alert,
                                        'orders__table-status--success': should_highlight_success,
                                        'orders__table-status--disabled': should_highlight_disabled,
                                    })}
                                >
                                    {status_string}
                                </div>
                            </Table.Cell>
                            <Table.Cell className='orders__expander-header-right'>
                                {is_timer_visible && <div className='orders__expander-time'>{remaining_time}</div>}
                                <div className='orders__expander-chat'>
                                    <Icon icon='IcChat' size={16} />
                                </div>
                            </Table.Cell>
                        </Table.Row>
                    </div>
                    <ContentExpander measure={measure} title={title()} is_expanded={false} is_title_spaced>
                        <div className='orders__expander-separator' />
                        <div className='orders__expander-content'>
                            <div>
                                <Text color='less-prominent' as='p' size='xxs' line_height='m'>
                                    {localize('Counterparty')}
                                </Text>
                                <Text color='prominent' as='p' size='xs' line_height='m'>
                                    {other_user_details.name}
                                </Text>
                            </div>
                            <div>
                                <Text color='less-prominent' as='p' size='xxs' line_height='m'>
                                    {localize('Order ID')}
                                </Text>
                                <Text color='prominent' as='p' size='xs' line_height='m'>
                                    {id}
                                </Text>
                            </div>
                            <div>
                                <Text color='less-prominent' as='p' size='xxs' line_height='m'>
                                    {localize('Send')}
                                </Text>
                                <Text color='prominent' as='p' size='xs' line_height='m'>
                                    {(is_buy_order && !is_my_ad) || (is_sell_order && is_my_ad)
                                        ? transaction_amount
                                        : offer_amount}
                                </Text>
                            </div>
                            <div>
                                <Text color='less-prominent' as='p' size='xxs' line_height='m'>
                                    {localize('Receive')}
                                </Text>
                                <Text color='prominent' as='p' size='xs' line_height='m'>
                                    {(is_buy_order && !is_my_ad) || (is_sell_order && is_my_ad)
                                        ? offer_amount
                                        : transaction_amount}
                                </Text>
                            </div>
                        </div>
                    </ContentExpander>
                </div>
            ) : (
                <div onClick={() => order_store.setQueryDetails(order)} style={style}>
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
            )}
            :
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
