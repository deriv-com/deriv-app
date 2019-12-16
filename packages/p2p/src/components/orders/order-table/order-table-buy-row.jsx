import { Table }                  from 'deriv-components';
import PropTypes                  from 'prop-types';
import React                      from 'react';
import { localize }               from 'Components/i18next';
// TODO: [p2p-uncomment] uncomment this when API sends epoch for time
// import { getFormattedDateString } from 'Utils/date-time';

const BuyOrderRowComponent = React.memo(({ data, onOpenDetails, style }) => {
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
        <div style={ style }>
            <Table.Row>
                <Table.Cell>
                    <span>
                        { localize('Buy') }<br />
                        <a
                            onClick={() => onOpenDetails(data)}
                            className='link'
                        >
                            { order_id }
                        </a>
                    </span>
                </Table.Cell>
                <Table.Cell>{ display_status }</Table.Cell>
                <Table.Cell>{ transaction_currency }{ ' ' }{ display_transaction_amount }</Table.Cell>
                <Table.Cell>{ offer_currency }{ ' ' }{ display_offer_amount }</Table.Cell>
                <Table.Cell>{ order_purchase_datetime }</Table.Cell>
            </Table.Row>
        </div>
    );
});

BuyOrderRowComponent.propTypes = {
    data: PropTypes.shape({
        display_offer_amount      : PropTypes.string,
        display_status            : PropTypes.string,
        display_transaction_amount: PropTypes.string,
        offer_currency            : PropTypes.string,
        order_id                  : PropTypes.oneOfType([ PropTypes.string, PropTypes.number ]),
        order_purchase_datetime   : PropTypes.date,
        transaction_currency      : PropTypes.string,
    }),
    onOpenDetails: PropTypes.func,
    style        : PropTypes.object,
};

BuyOrderRowComponent.displayName = 'BuyOrderRowComponent';

export default BuyOrderRowComponent;
