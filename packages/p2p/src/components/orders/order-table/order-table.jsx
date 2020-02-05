import { Table } from '@deriv/components';
import React from 'react';
import PropTypes from 'prop-types';
import { BuySellRowLoader } from 'Components/buy-sell/row.jsx';
import { localize } from 'Components/i18next';
import { InfiniteLoaderList } from 'Components/table/infinite-loader-list.jsx';
import BuyOrderRowComponent from './order-table-buy-row.jsx';
import SellOrderRowComponent from './order-table-sell-row.jsx';
import OrderInfo from '../order-info';

const OrderTable = ({ orders, showDetails }) => {
    const [order_list, setOrderList] = React.useState([]);

    React.useEffect(() => {
        const modified_list = orders.map(list => new OrderInfo(list));
        setOrderList(modified_list);
    }, [orders]);

    const Row = row_props =>
        row_props.data.is_buyer ? (
            <BuyOrderRowComponent {...row_props} onOpenDetails={showDetails} />
        ) : (
            <SellOrderRowComponent {...row_props} onOpenDetails={showDetails} />
        );

    return (
        <Table>
            <Table.Header>
                <Table.Row>
                    <Table.Head>{localize('Order ID')}</Table.Head>
                    <Table.Head>{localize('Time')}</Table.Head>
                    <Table.Head>{localize('Status')}</Table.Head>
                    <Table.Head>{localize('Send')}</Table.Head>
                    <Table.Head>{localize('Receive')}</Table.Head>
                </Table.Row>
            </Table.Header>
            <Table.Body>
                {order_list.length ? (
                    <InfiniteLoaderList
                        items={order_list}
                        item_size={72}
                        RenderComponent={Row}
                        RowLoader={BuySellRowLoader}
                    />
                ) : (
                    <div className='deriv-p2p__empty'>{localize('No orders')}</div>
                )}
            </Table.Body>
        </Table>
    );
};

OrderTable.propTypes = {
    orders: PropTypes.array,
    showDetails: PropTypes.func,
};

export default OrderTable;
