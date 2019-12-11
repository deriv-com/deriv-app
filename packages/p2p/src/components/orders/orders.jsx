import React        from 'react';
import { localize } from 'Components/i18next';
import PageReturn   from 'Components/page-return/page-return.jsx';
import OrderDetails from './order-details/order-details.jsx';
import OrderInfo    from './order-info';
import OrderTable   from './order-table/order-table.jsx';
import './orders.scss';

const Orders = ({ params }) => {
    // const buy_order = new OrderInfo();
    // const sell_order = new OrderInfo();
    // sell_order.type = 'sell';
    // sell_order.order_id = 'SELL123';
    // sell_order.counterparty = 'Ronald McDonald';
    const [order_details, setDetails] = React.useState(null);
    // TODO: [p2p-replace-with-api] - remove these dev toggle once data fetch works
    const showDetails = (order) => {
        console.log(order)
        setDetails(order)
    };
    const hideDetails = () => setDetails(null);

    // TODO: [p2p-replace-with-api] - Link next 4 lines with API
    // const is_loading_more        = false;
    // const has_more_items_to_load = false;
    // const loadMore               = () => { console.log('Load more'); /* eslint-disable-line no-console */ };
    // const items                  = [ buy_order, sell_order ];

    React.useEffect(() => {
        if (params && params.order_info) {
            const order_info = new OrderInfo(params.order_info);
            setDetails(order_info);
        }
    }, []);

    return (
        <div className='orders'>
            { order_details &&
                <React.Fragment>
                    <PageReturn
                        onClick={ hideDetails }
                        page_title={
                            order_details.is_buyer ?
                                localize('Buy {{offered_currency}} order', { offered_currency: order_details.offer_currency })
                                :
                                localize('Sell {{offered_currency}} order', { offered_currency: order_details.offer_currency })
                        }
                    />
                    <OrderDetails
                        order_details={ order_details }
                    />
                </React.Fragment>
            }
            { !order_details &&
                <OrderTable
                    // is_loading_more={ is_loading_more }
                    // has_more_items_to_load={ has_more_items_to_load }
                    // loadMore={ loadMore }
                    showDetails={ showDetails }
                />
            }
        </div>
    );
};

export default Orders;
