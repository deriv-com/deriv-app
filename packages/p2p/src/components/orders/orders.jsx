import React from 'react';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react-lite';
import { localize } from 'Components/i18next';
import PageReturn from 'Components/page-return/page-return.jsx';
import { useStores } from 'Stores';
import OrderTable from './order-table.jsx';
import OrderDetails from '../order-details/order-details.jsx';
import './orders.scss';

const Orders = observer(() => {
    const { general_store, order_store } = useStores();

    React.useEffect(() => {
        return () => order_store.onUnmount();
    }, []);

    React.useEffect(() => {
        order_store.onOrderIdUpdate();
    }, [general_store.props.order_id]);

    React.useEffect(() => {
        order_store.onOrdersUpdate();
    }, [general_store.orders]);

    if (order_store.order_information) {
        const { order_information } = order_store;
        return (
            <div className='orders orders--order-view'>
                <PageReturn
                    onClick={() => order_store.hideDetails(true)}
                    page_title={
                        (order_information.is_buy_order && !order_information.is_my_ad) ||
                        (order_information.is_sell_order && order_information.is_my_ad)
                            ? localize('Buy {{offered_currency}} order', {
                                  offered_currency: order_information.account_currency,
                              })
                            : localize('Sell {{offered_currency}} order', {
                                  offered_currency: order_information.account_currency,
                              })
                    }
                />
                <OrderDetails />
            </div>
        );
    }

    return (
        <div className='orders'>
            <OrderTable />
        </div>
    );
});

Orders.propTypes = {
    hideDetails: PropTypes.func,
    order_information: PropTypes.object,
    onOrderIdUpdate: PropTypes.func,
    onUnmount: PropTypes.func,
};

export default Orders;
