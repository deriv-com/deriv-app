import { Table }    from '@deriv/components';
import classNames   from 'classnames';
import PropTypes    from 'prop-types';
import React        from 'react';
import { localize } from 'Components/i18next';
// TODO: [p2p-uncomment] uncomment this when API sends epoch for time
// import { getFormattedDateString } from 'Utils/date-time';

const BuyOrderRowComponent = React.memo(({ data, is_agent, onOpenDetails, style }) => {
    const {
        display_transaction_amount,
        display_offer_amount,
        display_status,
        order_id,
        order_purchase_datetime,
        offer_currency,
        transaction_currency,
    } = data;

    return (
        <div
            onClick={() => onOpenDetails(data)}
            style={style}
            className={classNames('orders__table-row', {
                'orders__table-row--attention': (!is_agent && display_status === 'Unpaid') || (is_agent && display_status === 'Paid'),
            })}
        >
            <Table.Row>
                <Table.Cell>{ localize('Buy') }{' '}{ order_id }</Table.Cell>
                <Table.Cell>{ order_purchase_datetime }</Table.Cell>
                <Table.Cell className={classNames('orders__table-cell', {
                    'orders__table-cell--primary' : display_status === 'Unpaid' || display_status === 'Paid',
                    'orders__table-cell--success' : display_status === 'Completed',
                    'orders__table-cell--disabled': display_status === 'Cancelled',
                })}
                >
                    { display_status }
                </Table.Cell>
                {is_agent && <Table.Cell>{ display_offer_amount }{ ' ' }{ offer_currency }</Table.Cell>}
                {is_agent && <Table.Cell>{ display_transaction_amount }{ ' ' }{ transaction_currency }</Table.Cell>}
                {!is_agent && <Table.Cell>{ display_transaction_amount }{ ' ' }{ transaction_currency }</Table.Cell>}
                {!is_agent && <Table.Cell>{ display_offer_amount }{ ' ' }{ offer_currency }</Table.Cell>}
            </Table.Row>
        </div>
    );
});

BuyOrderRowComponent.propTypes = {
    data: PropTypes.shape({
        display_offer_amount      : PropTypes.string,
        display_status            : PropTypes.string,
        display_transaction_amount: PropTypes.string,
        is_agent                  : PropTypes.bool,
        offer_currency            : PropTypes.string,
        order_id                  : PropTypes.oneOfType([ PropTypes.string, PropTypes.number ]),
        order_purchase_datetime   : PropTypes.string,
        transaction_currency      : PropTypes.string,
    }),
    onOpenDetails: PropTypes.func,
    style        : PropTypes.object,
};

BuyOrderRowComponent.displayName = 'BuyOrderRowComponent';

export default BuyOrderRowComponent;
