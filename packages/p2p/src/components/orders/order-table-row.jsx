import { Table } from '@deriv/components';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import { observer } from 'mobx-react-lite';
import { Localize } from 'Components/i18next';
import { useStores } from 'Stores';

const OrderRowComponent = observer(props => {
    const { general_store, order_store } = useStores();
    order_store.setRowProps(props);

    const {
        amount_display,
        id,
        is_buy_order,
        is_completed_order,
        is_my_ad,
        is_sell_order,
        local_currency,
        order_purchase_datetime,
        other_user_details,
        price_display,
        should_highlight_alert,
        should_highlight_danger,
        should_highlight_disabled,
        status_string,
    } = order_store.order;

    const offer_amount = `${amount_display} ${general_store.client.currency}`;
    const transaction_amount = `${price_display} ${local_currency}`;

    React.useEffect(() => {
        order_store.onRowMount();
        return () => order_store.onRowUnmount();
    }, []);

    return (
        <div onClick={() => order_store.setQueryDetails(order_store.order)} style={order_store.style}>
            <Table.Row
                className={classNames('orders__table-row orders__table-grid', {
                    'orders__table-grid--active': general_store.is_active_tab,
                    'orders__table-row--attention': !order_store.isOrderSeen(id),
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
                            'orders__table-status--success': is_completed_order,
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
                        <div className='orders__table-time'>{order_store.remaining_time}</div>
                    ) : (
                        order_purchase_datetime
                    )}
                </Table.Cell>
            </Table.Row>
        </div>
    );
});

OrderRowComponent.propTypes = {
    data: PropTypes.object,
    style: PropTypes.object,
};

OrderRowComponent.displayName = 'OrderRowComponent';

export default OrderRowComponent;
