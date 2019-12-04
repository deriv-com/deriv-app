/* eslint-disable react/prop-types */
/* eslint-disable */
import React from 'react';
import { Table , Button } from 'deriv-components';
import { localize } from 'deriv-translations';
import { InfiniteLoaderList } from '../table/infinite-loader-list.jsx';
import { TableLayout } from '../table/table-layout.jsx';

const mock_response = { ad_id: 'Buy 000023434', amount: 'BTC 0.00001234', price: '34,000 MYR/BTC', min_transaction: 'MYR 50', payment_method: 'Bank transfer' };
const data = [
    { ad_id: 'Buy 000023434', amount: 'BTC 0.00001234', price: '34,000 MYR/BTC', min_transaction: 'MYR 50', payment_method: 'Bank transfer' },
    { ad_id: 'Buy 000023434', amount: 'BTC 0.00001234', price: '34,000 MYR/BTC', min_transaction: 'MYR 50', payment_method: 'Bank transfer' },
    { ad_id: 'Buy 000023434', amount: 'BTC 0.00001234', price: '34,000 MYR/BTC', min_transaction: 'MYR 50', payment_method: 'Bank transfer' },
    { ad_id: 'Buy 000023434', amount: 'BTC 0.00001234', price: '34,000 MYR/BTC', min_transaction: 'MYR 50', payment_method: 'Bank transfer' },
    { ad_id: 'Buy 000023434', amount: 'BTC 0.00001234', price: '34,000 MYR/BTC', min_transaction: 'MYR 50', payment_method: 'Bank transfer' },
    { ad_id: 'Buy 000023434', amount: 'BTC 0.00001234', price: '34,000 MYR/BTC', min_transaction: 'MYR 50', payment_method: 'Bank transfer' },
    { ad_id: 'Buy 000023434', amount: 'BTC 0.00001234', price: '34,000 MYR/BTC', min_transaction: 'MYR 50', payment_method: 'Bank transfer' },
];

const getMockData = () => {
    return new Promise((resolve, reject) => {
        setTimeout(function() {
            resolve({ ...mock_response });
        }, 300);
    });
};

const headers = [
    { text: localize('Ad ID'), align: 'left'  },
    { text: localize('Amount'), align: 'right' },
    { text: localize('Price'), align: 'right' },
    { text: localize('Min transaction'), align: 'right' },
    { text: localize('Payment Method'), align: 'left'}
];

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

export class MyAdsTable extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            items                 : data,
            is_loading_more_items : false,
            has_more_items_to_load: true,
        };
        this.table_container_ref = React.createRef();
    }
    
    loadMore = () => {
        this.setState({ is_loading_more_items: true }, () => {
            getMockData().then((d) => {
                this.setState({
                    is_loading_more_items: false,
                    items           : [...this.state.items, d],
                });
            });
        });
    }
    componentDidMount() {
        this.setState({ width: this.table_container_ref.current.offsetWidth });
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
                        <InfiniteLoaderList
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
