import React                  from 'react';
import PropTypes              from 'prop-types';
import { Loading }            from 'deriv-components';
import { InfiniteLoaderList } from 'Components/table/infinite-loader-list.jsx';
import { MockWS }             from 'Utils/websocket';
import {
    RowComponent,
    BuySellRowLoader }        from './row.jsx';

export class BuyTable extends React.Component {
    // TODO: Find a better solution for handling no-op instead of using is_mounted flags
    is_mounted = false;

    state = {
        items     : null,
        is_loading: true,
    };

    componentDidMount() {
        this.is_mounted = true;

        MockWS({ p2p_offer_list: 1, type: 'buy' }).then((response) => {
            if (this.is_mounted) {
                this.setState({ items: response, is_loading: false });
            }
        });
    }

    componentWillUnmount() {
        this.is_mounted = false;
    }

    render() {
        const { is_loading, items } = this.state;
        const { setSelectedAd } = this.props;

        const Row = props => <RowComponent {...props} is_buy setSelectedAd={setSelectedAd} />;

        if (is_loading) return <Loading is_fullscreen={false} />;

        return (
            <InfiniteLoaderList
                items={items}
                RenderComponent={Row}
                RowLoader={BuySellRowLoader}
            />
        );
    }
}

BuyTable.propTypes = {
    setSelectedAd: PropTypes.func,
};
