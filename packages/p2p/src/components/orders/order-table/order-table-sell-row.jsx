import { Table } from '@deriv/components';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import { localize } from 'Components/i18next';

const SellOrderRowComponent = React.memo(({ data, onOpenDetails, style }) => {
    const {
        advertiser_name,
        display_transaction_amount,
        display_offer_amount,
        display_status,
        id,
        order_purchase_datetime,
        offer_currency,
        transaction_currency,
        is_buyer_confirmed,
        is_buyer_cancelled,
        is_expired,
        is_pending,
        is_completed,
    } = data;

    return (
        <div
            onClick={() => onOpenDetails(data)}
            style={style}
            className={classNames('orders__table-row', {
                'orders__table-row--attention': is_buyer_confirmed,
            })}
        >
            <Table.Row>
                <Table.Cell>
                    {localize('Sell')} {id}
                </Table.Cell>
                <Table.Cell>{advertiser_name === '' ? '-' : advertiser_name}</Table.Cell>
                <Table.Cell>
                    <div
                        className={classNames('orders__table-status', {
                            'orders__table-status--primary': is_pending,
                            'orders__table-status--secondary': is_buyer_confirmed,
                            'orders__table-status--success': is_completed,
                            'orders__table-status--disabled': is_buyer_cancelled || is_expired,
                        })}
                    >
                        {display_status}
                    </div>
                </Table.Cell>
                <Table.Cell>
                    {display_offer_amount} {offer_currency}
                </Table.Cell>
                <Table.Cell>
                    {display_transaction_amount} {transaction_currency}
                </Table.Cell>
                <Table.Cell>{order_purchase_datetime}</Table.Cell>
            </Table.Row>
        </div>
    );
});

SellOrderRowComponent.propTypes = {
    data: PropTypes.shape({
        display_offer_amount: PropTypes.string,
        display_status: PropTypes.string,
        display_transaction_amount: PropTypes.string,
        offer_currency: PropTypes.string,
        id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        order_purchase_datetime: PropTypes.string,
        transaction_currency: PropTypes.string,
    }),
    onOpenDetails: PropTypes.func,
    style: PropTypes.object,
};

SellOrderRowComponent.displayName = 'SellOrderRowComponent';

export default SellOrderRowComponent;
