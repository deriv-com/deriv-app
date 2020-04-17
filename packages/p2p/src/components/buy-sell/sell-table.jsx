import React from 'react';
import PropTypes from 'prop-types';
import { Loading, Icon } from '@deriv/components';
import { localize } from 'Components/i18next';
import { InfiniteLoaderList } from 'Components/table/infinite-loader-list.jsx';
import { TableError } from 'Components/table/table-error.jsx';
import { requestWS } from 'Utils/websocket';
import { RowComponent, BuySellRowLoader } from './row.jsx';
import { BuySellTable } from './buy-sell-table.jsx';

export class SellTable extends React.Component {
    // TODO: Find a better solution for handling no-op instead of using is_mounted flags
    is_mounted = false;

    state = {
        api_error_message: '',
        has_more_items_to_load: true,
        is_loading: true,
        is_loading_more_items: false,
        items: null,
    };

    componentDidMount() {
        this.is_mounted = true;

        requestWS({ p2p_advert_list: 1, counterparty_type: 'sell' }).then(response => {
            if (this.is_mounted) {
                if (!response.error) {
                    this.setState({ items: response, is_loading: false });
                } else {
                    this.setState({ is_loading: false, api_error_message: response.error.message });
                }
            }
        });
    }

    componentWillUnmount() {
        this.is_mounted = false;
    }

    render() {
        const { api_error_message, items, is_loading } = this.state;
        const { setSelectedAd } = this.props;

        const Row = props => <RowComponent {...props} is_buy={false} setSelectedAd={setSelectedAd} />;

        if (is_loading) return <Loading is_fullscreen={false} />;

        if (api_error_message) return <TableError message={api_error_message} />;

        return items.length ? (
            <BuySellTable>
                <InfiniteLoaderList
                    // screen size - header size - footer size - page overlay header - page overlay content padding -
                    // tabs height - padding+margin of tab content - toggle height - table header height
                    initial_height={'calc(100vh - 48px - 36px - 41px - 2.4rem - 36px - 3.2rem - 40px - 52px)'}
                    items={items}
                    RenderComponent={Row}
                    RowLoader={BuySellRowLoader}
                />
            </BuySellTable>
        ) : (
            <div className='p2p-cashier__empty'>
                <div className='p2p-cashier__empty-item'>
                    <Icon icon='IcNoAd' size={128} />
                    <div className='p2p-cashier__empty-text'>{localize('No ads found')}</div>
                </div>
            </div>
        );
    }
}

SellTable.propTypes = {
    setSelectedAd: PropTypes.func,
};
