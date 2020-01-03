import { Table }    from 'deriv-components';
import PropTypes    from 'prop-types';
import React        from 'react';
import { localize } from 'Components/i18next';

const SellOrderRowComponent = React.memo(({ data, onOpenDetails, style }) => {
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
        <div onClick={() => onOpenDetails(data)} style={style} className='orders__table-row'>
            <Table.Row>
                <Table.Cell>
                    <span>
                        { localize('Sell') }<br />
                        <a
                            className='orders__table_link'
                        >
                            { order_id }
                        </a>
                    </span>
                </Table.Cell>
                <Table.Cell>{ order_purchase_datetime }</Table.Cell>
                <Table.Cell>{ display_status }</Table.Cell>
                <Table.Cell>{ offer_currency }{ ' ' }{ display_offer_amount }</Table.Cell>
                <Table.Cell>{ transaction_currency }{ ' ' }{ display_transaction_amount }</Table.Cell>
            </Table.Row>
        </div>
    );
});

SellOrderRowComponent.propTypes = {
    data: PropTypes.shape({
        display_offer_amount      : PropTypes.string,
        display_status            : PropTypes.string,
        display_transaction_amount: PropTypes.string,
        offer_currency            : PropTypes.string,
        order_id                  : PropTypes.oneOfType([ PropTypes.string, PropTypes.number ]),
        order_purchase_datetime   : PropTypes.string,
        transaction_currency      : PropTypes.string,
    }),
    onOpenDetails: PropTypes.func,
    style        : PropTypes.object,
};

SellOrderRowComponent.displayName = 'SellOrderRowComponent';

export default SellOrderRowComponent;
