import { Table } from '@deriv/components';
import React from 'react';
import PropTypes from 'prop-types';
import { BuySellRowLoader } from 'Components/buy-sell/row.jsx';
import Dp2pContext from 'Components/context/dp2p-context';
import { localize } from 'Components/i18next';
import { InfiniteLoaderList } from 'Components/table/infinite-loader-list.jsx';
import BuyOrderRowComponent from './order-table-buy-row.jsx';
import SellOrderRowComponent from './order-table-sell-row.jsx';
import OrderInfo from '../order-info';

const OrderTable = ({ orders, showDetails }) => {
    const [order_list, setOrderList] = React.useState([]);
    const { is_agent } = React.useContext(Dp2pContext);

    React.useEffect(() => {
        const modified_list = orders.map(list => new OrderInfo(list));
        setOrderList(modified_list);
    }, [orders]);

    const Row = row_props =>
        row_props.data.is_buyer ? (
            <BuyOrderRowComponent {...row_props} is_agent={is_agent} onOpenDetails={showDetails} />
        ) : (
            <SellOrderRowComponent {...row_props} is_agent={is_agent} onOpenDetails={showDetails} />
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
                        // screen size - header size - footer size - page overlay header - page overlay content padding -
                        // tabs height - padding of tab content - table header height
                        initial_height={'calc(100vh - 48px - 36px - 41px - 2.4rem - 36px - 2.4rem - 52px)'}
                        items={order_list}
                        item_size={72}
                        RenderComponent={Row}
                        RowLoader={BuySellRowLoader}
                    />
                ) : (
                    <div className='orders__empty'>{localize('No orders found')}</div>
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
