import { Table } from '@deriv/components';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import { localize } from 'Components/i18next';

const OrderRowComponent = React.memo(({ data, onOpenDetails, style, is_active }) => {
    const {
        advertiser_name,
        display_transaction_amount,
        display_offer_amount,
        display_status,
        id,
        order_purchase_datetime,
        order_purchase_time,
        offer_currency,
        transaction_currency,
        is_buyer,
        is_buyer_confirmed,
        is_buyer_cancelled,
        is_expired,
        is_pending,
        is_completed,
        is_refunded,
    } = data;

    const max_word_count = 22;
    let counter_party = '-';

    if (advertiser_name !== '') {
        counter_party =
            advertiser_name.length > max_word_count
                ? `${advertiser_name.substring(0, max_word_count)}...`
                : advertiser_name;
    }

    const offer_amount = `${display_offer_amount} ${offer_currency}`;
    const transaction_amount = `${display_transaction_amount} ${transaction_currency}`;

    return (
        <div onClick={() => onOpenDetails(data)} style={style}>
            <Table.Row
                className={classNames('orders__table-row orders__table-grid', {
                    'orders__table-grid--active': is_active,
                    'orders__table-row--attention': is_pending,
                })}
            >
                <Table.Cell>{is_buyer ? localize('Buy') : localize('Sell')}</Table.Cell>
                <Table.Cell>{id}</Table.Cell>
                <Table.Cell>{counter_party}</Table.Cell>
                <Table.Cell>
                    <div
                        className={classNames('orders__table-status', {
                            'orders__table-status--primary': is_pending,
                            'orders__table-status--secondary': is_buyer_confirmed,
                            'orders__table-status--success': is_completed,
                            'orders__table-status--info': is_refunded,
                            'orders__table-status--disabled': is_buyer_cancelled || is_expired,
                        })}
                    >
                        {display_status}
                    </div>
                </Table.Cell>
                <Table.Cell>{is_buyer ? transaction_amount : offer_amount}</Table.Cell>
                <Table.Cell>{is_buyer ? offer_amount : transaction_amount}</Table.Cell>
                <Table.Cell>
                    {is_active ? (
                        <div className='orders__table-time'>{order_purchase_time}</div>
                    ) : (
                        order_purchase_datetime
                    )}
                </Table.Cell>
            </Table.Row>
        </div>
    );
});

OrderRowComponent.propTypes = {
    data: PropTypes.shape({
        display_offer_amount: PropTypes.string,
        display_status: PropTypes.string,
        display_transaction_amount: PropTypes.string,
        offer_currency: PropTypes.string,
        id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        order_purchase_datetime: PropTypes.string,
        transaction_currency: PropTypes.string,
        is_buyer: PropTypes.bool,
    }),
    onOpenDetails: PropTypes.func,
    style: PropTypes.object,
};

OrderRowComponent.displayName = 'OrderRowComponent';

export default OrderRowComponent;
