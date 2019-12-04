/* eslint-disable react/prop-types */
import React from 'react';
import { Table } from 'deriv-components';
import { FixedSizeList as List } from 'react-window';
import InfiniteLoader from 'react-window-infinite-loader';
import { Button } from 'deriv-components';

// import { localize } from 'deriv-translations';
const headers = ['Ad ID', 'Amount', 'Price', 'Min transaction', 'Payment Method'];
const mock_obj = { ad_id: 'Buy 000023434', amount: 'BTC 0.00001234', price: '34,000 MYR/BTC', min_transaction: 'MYR 50', payment_method: 'Bank transfer' };

const data = [
    { ad_id: 'Buy 000023434', amount: 'BTC 0.00001234', price: '34,000 MYR/BTC', min_transaction: 'MYR 50', payment_method: 'Bank transfer' },
    { ad_id: 'Buy 000023434', amount: 'BTC 0.00001234', price: '34,000 MYR/BTC', min_transaction: 'MYR 50', payment_method: 'Bank transfer' },
    { ad_id: 'Buy 000023434', amount: 'BTC 0.00001234', price: '34,000 MYR/BTC', min_transaction: 'MYR 50', payment_method: 'Bank transfer' },
    { ad_id: 'Buy 000023434', amount: 'BTC 0.00001234', price: '34,000 MYR/BTC', min_transaction: 'MYR 50', payment_method: 'Bank transfer' },
    { ad_id: 'Buy 000023434', amount: 'BTC 0.00001234', price: '34,000 MYR/BTC', min_transaction: 'MYR 50', payment_method: 'Bank transfer' },
    { ad_id: 'Buy 000023434', amount: 'BTC 0.00001234', price: '34,000 MYR/BTC', min_transaction: 'MYR 50', payment_method: 'Bank transfer' },
    { ad_id: 'Buy 000023434', amount: 'BTC 0.00001234', price: '34,000 MYR/BTC', min_transaction: 'MYR 50', payment_method: 'Bank transfer' },
];

const dataPromise = () => {
    return new Promise((resolve, reject) => {
        setTimeout(function() {
            resolve({ ...mock_obj });
        }, 300);
    });
};
// List component
const ListComponent = ({ items, moreItemsLoading, loadMore, hasNextPage, RowComponent, height, width }) => {
    const RowRenderer = ({ index, style }) => (
        <RowComponent data={items[index]} num={index} style={style} loading={index === items.length} />
    );

    const itemCount = hasNextPage ? items.length + 1 : items.length;

    return (
        <InfiniteLoader
            isItemLoaded={index => index < items.length}
            itemCount={itemCount}
            loadMoreItems={loadMore}
        >
            {({ onItemsRendered, ref }) => (
                <List
                    height={height || 500}
                    width={width || 602}
                    itemCount={itemCount}
                    itemSize={80}
                    onItemsRendered={onItemsRendered}
                    ref={ref}
                >
                    {RowRenderer}
                </List>
            )}
        </InfiniteLoader>
    );
};

const RowComponent = ({  data, num, style, loading }) => {
    return loading ?
        <div style={style}>Loading...</div> :
        <div style={style}>
            <Table.Row>
                <Table.Cell>{data.ad_id}</Table.Cell>
                <Table.Cell>{data.amount}</Table.Cell>
                <Table.Cell>{data.price}</Table.Cell>
                <Table.Cell>{data.min_transaction}</Table.Cell>
                <Table.Cell>{data.payment_method}</Table.Cell>
                <Table.Cell>
                    <Button secondary small>Edit</Button>
                    <Button secondary small>Delete</Button>
                </Table.Cell>
            </Table.Row>
        </div>;
};
export class MyAdsTable extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            items           : data,
            moreItemsLoading: false,
            hasNextPage     : true,
        };
    }
    
    loadMore = () => {
        this.setState({ moreItemsLoading: true }, () => {
            dataPromise().then((d) => {
                this.setState({
                    moreItemsLoading: false,
                    items           : [...this.state.items, d],
                });
            });
        });
    }

    render() {
        const { items, moreItemsLoading, hasNextPage } = this.state;

        return (
            <Table>
                <Table.Header>
                    <Table.Row>
                        {headers.map(text => <Table.Head key={text}>{text}</Table.Head>)}
                        <Table.Head />
                    </Table.Row>
                </Table.Header>
                <Table.Body>
                    <ListComponent
                        items={items}
                        moreItemsLoading={moreItemsLoading}
                        loadMore={this.loadMore}
                        hasNextPage={hasNextPage}
                        RowComponent={RowComponent}
                    />
                </Table.Body>
            </Table>

        );
    }
}
