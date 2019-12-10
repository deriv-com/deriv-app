import { Table }                  from 'deriv-components';
import PropTypes                  from 'prop-types';
import React                      from 'react';
import { getFormattedDateString } from 'Utils/date-time';

// TODO: [p2p-refactor-row-component] - Reuse row component that we have in other places
const BuyOrderRowComponent = React.memo(({ data, onOpenDetails, style }) => {
    const {
        counterparty,
        display_transaction_amount,
        display_offer_amount,
        order_id,
        order_purchase_datetime,
        offer_currency,
        status,
        transaction_currency,
    } = data;

    return (
        <div style={style}>
            <Table.Row>
                <Table.Cell><span>Buy<br /><a onClick={ () => onOpenDetails(data) } className='link'>{ order_id }</a></span></Table.Cell>
                <Table.Cell>{status /* TODO: [p2p-order-status-mapping] */}</Table.Cell>
                <Table.Cell>{transaction_currency}{' '}{display_transaction_amount}</Table.Cell>
                <Table.Cell>{offer_currency}{' '}{display_offer_amount}</Table.Cell>
                <Table.Cell>{counterparty}</Table.Cell>
                <Table.Cell>{getFormattedDateString(order_purchase_datetime)}</Table.Cell>
            </Table.Row>
        </div>
    );
});

BuyOrderRowComponent.propTypes = {
    data: PropTypes.shape({
        counterparty              : PropTypes.string,
        display_transaction_amount: PropTypes.string,
        display_offer_amount      : PropTypes.string,
        order_id                  : PropTypes.oneOfType([ PropTypes.string, PropTypes.number ]),
        order_purchase_datetime   : PropTypes.date,
        offer_currency            : PropTypes.string,
        status                    : PropTypes.string,
        transaction_currency      : PropTypes.string,
    }),
    onOpenDetails: PropTypes.func,
    style        : PropTypes.object,
};

BuyOrderRowComponent.displayName = 'BuyOrderRowComponent';

export default BuyOrderRowComponent;
