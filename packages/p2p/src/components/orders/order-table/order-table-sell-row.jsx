import { Table } from '@deriv/components';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import { localize } from 'Components/i18next';

const SellOrderRowComponent = React.memo(({ data, is_agent, onOpenDetails, style }) => {
    const {
        display_transaction_amount,
        display_offer_amount,
        display_status,
        order_id,
        order_purchase_datetime,
        offer_currency,
        transaction_currency,
        is_buyer_confirmed,
        is_buyer_cancelled,
        is_pending,
        is_completed,
    } = data;

    return (
        <div
            onClick={() => onOpenDetails(data)}
            style={style}
            className={classNames('orders__table-row', {
                'orders__table-row--attention': (!is_agent && is_buyer_confirmed) || (is_agent && is_pending),
            })}
        >
            <Table.Row>
                <Table.Cell>
                    {localize('Sell')} {order_id}
                </Table.Cell>
                <Table.Cell>{order_purchase_datetime}</Table.Cell>
                <Table.Cell
                    className={classNames('orders__table-cell', {
                        'orders__table-cell--primary': is_pending || is_buyer_confirmed,
                        'orders__table-cell--success': is_completed,
                        'orders__table-cell--disabled': is_buyer_cancelled,
                    })}
                >
                    {display_status}
                </Table.Cell>
                {is_agent && (
                    <Table.Cell>
                        {display_transaction_amount} {transaction_currency}
                    </Table.Cell>
                )}
                {is_agent && (
                    <Table.Cell>
                        {display_offer_amount} {offer_currency}
                    </Table.Cell>
                )}
                {!is_agent && (
                    <Table.Cell>
                        {display_offer_amount} {offer_currency}
                    </Table.Cell>
                )}
                {!is_agent && (
                    <Table.Cell>
                        {display_transaction_amount} {transaction_currency}
                    </Table.Cell>
                )}
            </Table.Row>
        </div>
    );
});

SellOrderRowComponent.propTypes = {
    data: PropTypes.shape({
        display_offer_amount: PropTypes.string,
        display_status: PropTypes.string,
        display_transaction_amount: PropTypes.string,
        is_agent: PropTypes.bool,
        offer_currency: PropTypes.string,
        order_id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        order_purchase_datetime: PropTypes.string,
        transaction_currency: PropTypes.string,
    }),
    onOpenDetails: PropTypes.func,
    style: PropTypes.object,
};

SellOrderRowComponent.displayName = 'SellOrderRowComponent';

export default SellOrderRowComponent;
