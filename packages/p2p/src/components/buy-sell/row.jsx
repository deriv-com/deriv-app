import React             from 'react';
import PropTypes         from 'prop-types';
import ContentLoader     from 'react-content-loader';
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

export const BuySellRowLoader = ({ width }) => (
    <ContentLoader
        height={64}
        width={900 || width}
        speed={2}
        primaryColor={'var(--general-hover)'}
        secondaryColor={'var(--general-active)'}
    >
        <rect x='1' y='20' rx='5' ry='5' width='90' height='10' />
        <rect x='150' y='20' rx='5' ry='5' width='90' height='10' />
        <rect x='300' y='20' rx='5' ry='5' width='90' height='10' />
        <rect x='446' y='20' rx='5' ry='5' width='90' height='10' />
        <rect x='600' y='20' rx='5' ry='5' width='90' height='10' />
        <rect x='750' y='15' rx='5' ry='5' width='45' height='18' />
    </ContentLoader>
);
BuySellRowLoader.propTypes = {
    width: PropTypes.number,
};

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
