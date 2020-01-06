import { Table }              from '@deriv/components';
import React                  from 'react';
import PropTypes              from 'prop-types';
import { BuySellRowLoader }   from 'Components/buy-sell/row.jsx';
import { localize }           from 'Components/i18next';
import { InfiniteLoaderList } from 'Components/table/infinite-loader-list.jsx';
import { requestWS }          from 'Utils/websocket';
import BuyOrderRowComponent   from './order-table-buy-row.jsx';
import SellOrderRowComponent  from './order-table-sell-row.jsx';
import OrderInfo              from '../order-info';

const OrderTable = ({ showDetails }) => {
    const [order_list, setOrderList] = React.useState([]);
    const [has_no_orders, setNoOrders] = React.useState(false);

    React.useEffect(() => {
        requestWS({ p2p_order_list: 1 }).then(list_response => {
            const modified_list = list_response.map(list => new OrderInfo(list));
            setOrderList(modified_list);
            if (!modified_list.length) {
                setNoOrders(true);
            }
        });
    }, []);

    const Row = (row_props) => (
        row_props.data.is_buyer ?
            <BuyOrderRowComponent { ...row_props } onOpenDetails={ showDetails } />
            :
            <SellOrderRowComponent { ...row_props } onOpenDetails={ showDetails } />
    );

    return (
        <Table>
            <Table.Header>
                <Table.Row>
                    <Table.Head>{ localize('Order ID') }</Table.Head>
                    <Table.Head>{ localize('Time') }</Table.Head>
                    <Table.Head>{ localize('Status') }</Table.Head>
                    <Table.Head>{ localize('Send') }</Table.Head>
                    <Table.Head>{ localize('Receive') }</Table.Head>
                </Table.Row>
            </Table.Header>
            <Table.Body>
                { has_no_orders ? (
                    <div className='orders__empty'>
                        {localize('No orders found')}
                    </div>
                ) : (
                    <InfiniteLoaderList
                        items={ order_list }
                        item_size={ 72 }
                        RenderComponent={ Row }
                        RowLoader={ BuySellRowLoader }
                    />
                ) }

            </Table.Body>
        </Table>
    );
};

OrderTable.propTypes = {
    showDetails: PropTypes.func,
};

export default OrderTable;
