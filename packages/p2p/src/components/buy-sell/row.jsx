import React             from 'react';
import PropTypes         from 'prop-types';
import { Table, Button } from 'deriv-components';
import { localize }      from 'deriv-translations';

export const headers = [
    { text: localize('Advertisers')  },
    { text: localize('Amount') },
    { text: localize('Price for 1 BTC') },
    { text: localize('Min transaction') },
    { text: localize('Payment Method') },
    { text: localize('Trade') },
];

export const RowComponent = React.memo(({ data, style, is_buy, setSelectedAd }) => (
    <div style={style}>
        <Table.Row>
            <Table.Cell>{data.advertiser}</Table.Cell>
            <Table.Cell>{data.currency}{' '}{data.amount}</Table.Cell>
            <Table.Cell>{data.price}</Table.Cell>
            <Table.Cell>{data.currency}{' '}{data.min_transaction}</Table.Cell>
            <Table.Cell>{data.payment_method}</Table.Cell>
            <Table.Cell>
                <Button primary small onClick={() => setSelectedAd(data)}>
                    {is_buy ? localize('Buy') : localize('Sell')}
                </Button>
            </Table.Cell>
        </Table.Row>
    </div>
));
RowComponent.propTypes = {
    data         : PropTypes.object,
    style        : PropTypes.object,
    is_buy       : PropTypes.bool,
    setSelectedAd: PropTypes.func,
};
RowComponent.displayName = 'RowComponent';
