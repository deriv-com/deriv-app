import React from 'react';
import PropTypes from 'prop-types';
import { useHistory } from 'react-router';
import { ButtonToggle } from '@deriv/components';
import { routes } from '@deriv/shared';
import { useStore } from '@deriv/stores';
import { observer } from 'mobx-react-lite';
import { localize } from 'Components/i18next';
import ToggleContainer from 'Components/toggle-container';
import { order_list } from 'Constants/order-list';
import { useStores } from 'Stores';
import { checkRoutingHistory } from 'Utils/helper';
import OrderTableContent from './order-table-content.jsx';
import './order-table.scss';

const OrderTable = ({ showDetails }) => {
    const { general_store } = useStores();
    const history = useHistory();
    const { common } = useStore();
    const { app_routing_history } = common;
    const { scroll_to_index_value } = history.location.state ?? {};

    const is_from_order_details_page = checkRoutingHistory(app_routing_history, routes.p2p_orders);
    const [scroll_to_index, setScrollToIndex] = React.useState(
        scroll_to_index_value !== undefined ? scroll_to_index_value + 1 : -1
    );

    const orders_list_filters = [
        {
            text: localize('Active orders'),
            value: order_list.ACTIVE,
            count: general_store.active_notification_count,
        },
        {
            text: localize('Past orders'),
            value: order_list.INACTIVE,
            count: general_store.inactive_notification_count,
        },
    ];

    const is_active_tab = general_store.order_table_type === order_list.ACTIVE;

    React.useEffect(() => {
        if (scroll_to_index_value !== undefined && scroll_to_index_value !== -1) {
            setScrollToIndex(scroll_to_index_value + 1);
        }
    }, [scroll_to_index_value]);

    const clearScroll = () => {
        setScrollToIndex(-1);
    };

    return (
        <React.Fragment>
            <div className='order-table'>
                <div className='order-table__toggle-wrapper '>
                    <ToggleContainer>
                        <ButtonToggle
                            buttons_arr={orders_list_filters}
                            className='order-table__toggle-wrapper-filter'
                            is_animated
                            name='filter'
                            onChange={({ target: { value } }) => {
                                clearScroll();
                                general_store.setOrderTableType(value);
                            }}
                            value={general_store.order_table_type}
                            has_rounded_button
                        />
                    </ToggleContainer>
                </div>
            </div>
            <OrderTableContent
                showDetails={showDetails}
                is_active={is_active_tab}
                clearScroll={clearScroll}
                retain_scroll_position={is_from_order_details_page}
                scroll_to_index={scroll_to_index}
            />
        </React.Fragment>
    );
};

OrderTable.propTypes = {
    showDetails: PropTypes.func,
};

export default observer(OrderTable);
