import React                  from 'react';
import PropTypes              from 'prop-types';
import { Loading }            from 'deriv-components';
import { InfiniteLoaderList } from 'Components/table/infinite-loader-list.jsx';
import {
    RowComponent,
    BuySellRowLoader }        from './row.jsx';

// TODO: [p2p-replace-with-api] - replace with API response
const mock_response = {
    advertiser     : 'John Doe',
    price          : 'IDR 2,000,000.00',
    payment_method : 'Bank transfer',
    type           : 'buy',
    id             : 'buy_id',
    country        : 'Indonesia',
    currency       : 'IDR',
    asset          : 'USD',
    fix_price      : 12000,
    amount         : 20,
    min_transaction: 15000,
    max_transaction: 240000,
    advertiser_note: 'Whatsapp: +60182655318 please send to Maybank 239847238947 JOHN DOE',
};

const initial_data = [
    { ...mock_response },
    { ...mock_response },
    { ...mock_response },
    { ...mock_response },
];

const getMockData = () => {
    return new Promise(resolve => {
        setTimeout(function() {
            resolve([
                { ...mock_response }, { ...mock_response }, { ...mock_response }, { ...mock_response },
            ]);
        }, 300);
    });
};

export class SellTable extends React.Component {
    // TODO: Find a better solution for handling no-op instead of using is_mounted flags
    is_mounted = false

    state = {
        items                 : null,
        is_loading_more_items : false,
        has_more_items_to_load: true,
        is_loading            : true,
    };

    loadMore = () => {
        this.setState({ is_loading_more_items: true }, () => {
            getMockData().then((res) => {
                if (this.is_mounted) {
                    this.setState({
                        is_loading_more_items: false,
                        items                : [...this.state.items, ...res],
                    });
                }
            });
        });
    }

    componentDidMount() {
        this.is_mounted = true;
        setTimeout(() => {
            if (this.is_mounted) {
                this.setState({ items: initial_data, is_loading: false });
            }
        }, 1000);
    }

    componentWillUnmount() {
        this.is_mounted = false;
    }

    render() {
        const { items, is_loading_more_items, has_more_items_to_load, is_loading } = this.state;
        const { setSelectedAd } = this.props;

        const Row = props => <RowComponent {...props} is_buy={false} setSelectedAd={setSelectedAd} />;

        if (is_loading) return <Loading is_fullscreen={false} />;

        return (
            <InfiniteLoaderList
                items={items}
                is_loading_more_items={is_loading_more_items}
                loadMore={this.loadMore}
                has_more_items_to_load={has_more_items_to_load}
                RenderComponent={Row}
                RowLoader={BuySellRowLoader}
            />
        );
    }
}

SellTable.propTypes = {
    setSelectedAd: PropTypes.func,
};
