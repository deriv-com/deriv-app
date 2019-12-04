/* eslint-disable react/prop-types */
/* eslint-disable */
import React from 'react';
import { Table , Button } from 'deriv-components';
import { FixedSizeList as List } from 'react-window';
import InfiniteLoader from 'react-window-infinite-loader';

// import { localize } from 'deriv-translations';
const headers = [{ text: 'Ad ID', align: 'left' }, {text: 'Amount', align: 'right'}, {text: 'Price', align: 'right'}, {text: 'Min transaction', align:'right'}, {text: 'Payment Method', align: 'left'}];
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
const ListComponent = ({ items, is_loading_more_items, loadMore, has_more_items_to_load, RowComponent, height, width }) => {
    const RowRenderer = ({ index, style }) => (
        <RowComponent data={items[index]} num={index} style={style} loading={index === items.length} />
    );

    const itemCount = has_more_items_to_load ? items.length + 1 : items.length;

    return (
        <InfiniteLoader
            isItemLoaded={index => index < items.length}
            itemCount={itemCount}
            loadMoreItems={loadMore}
        >
            {({ onItemsRendered, ref }) => (
                <List
                    height={height || 500}
                    width={width || 960}
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
                <Table.Cell align='right'>{data.amount}</Table.Cell>
                <Table.Cell align='right'>{data.price}</Table.Cell>
                <Table.Cell align='right'>{data.min_transaction}</Table.Cell>
                <Table.Cell>{data.payment_method}</Table.Cell>
                <Table.Cell>
                    <div style={{ marginRight: '9px', }}>
                        <Button secondary small>Edit</Button>
                    </div>
                    <Button secondary small>Delete</Button>
                </Table.Cell>
            </Table.Row>
        </div>;
};

const TableLayout = React.forwardRef((props, ref) => (
    <div style={{ margin: '0 24px', }} ref={ref}>
      {props.children}
    </div>
  ));

export class MyAdsTable extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            items                 : data,
            is_loading_more_items : false,
            has_more_items_to_load: true,
        };
        this.table_container_ref = React.createRef()
    }
    
    loadMore = () => {
        this.setState({ is_loading_more_items: true }, () => {
            dataPromise().then((d) => {
                this.setState({
                    is_loading_more_items: false,
                    items           : [...this.state.items, d],
                });
            });
        });
    }
    componentDidMount() {
        this.setState({ width: this.table_container_ref.current.offsetWidth })
    }

    render() {
        const { items, is_loading_more_items, has_more_items_to_load, width, } = this.state;

        return (
            <TableLayout ref={this.table_container_ref}>
                <Table>
                    <Table.Header>
                        <Table.Row>
                            {headers.map(header =>
                                <Table.Head align={header.align} key={header.text}>{header.text}</Table.Head>)}
                        </Table.Row>
                    </Table.Header>
                    <Table.Body>
                        <ListComponent
                            items={items}
                            is_loading_more_items={is_loading_more_items}
                            loadMore={this.loadMore}
                            has_more_items_to_load={has_more_items_to_load}
                            RowComponent={RowComponent}
                            width={width}
                        />
                    </Table.Body>
                </Table>
            </TableLayout>
        );
    }
}
