import React                  from 'react';
import PropTypes              from 'prop-types';
import { Loading }            from 'deriv-components';
import { InfiniteLoaderList } from 'Components/table/infinite-loader-list.jsx';
import { TableDimensions }    from 'Components/table/table-dimensions.jsx';
import { MockWS }             from 'Utils/websocket';
import {
    RowComponent,
    BuySellRowLoader }        from './row.jsx';

export class SellTable extends React.Component {
    // TODO: Find a better solution for handling no-op instead of using is_mounted flags
    is_mounted = false

    state = {
        items                 : null,
        is_loading_more_items : false,
        has_more_items_to_load: true,
        is_loading            : true,
    };

    componentDidMount() {
        this.is_mounted = true;

        MockWS({ p2p_offer_list: 1, type: 'sell' }).then((response) => {
            if (this.is_mounted) {
                this.setState({ items: response, is_loading: false });
            }
        });
    }

    componentWillUnmount() {
        this.is_mounted = false;
    }

    render() {
        const { items, is_loading } = this.state;
        const { setSelectedAd } = this.props;

        const Row = props => <RowComponent {...props} is_buy={false} setSelectedAd={setSelectedAd} />;

        if (is_loading) return <Loading is_fullscreen={false} />;

        return (
            <TableDimensions>
                {dimensions =>
                    <InfiniteLoaderList
                        items={items}
                        RenderComponent={Row}
                        RowLoader={BuySellRowLoader}
                        width={dimensions.width}
                        height={dimensions.height}
                    />
                }
            </TableDimensions>
        );
    }
}

SellTable.propTypes = {
    setSelectedAd: PropTypes.func,
};
