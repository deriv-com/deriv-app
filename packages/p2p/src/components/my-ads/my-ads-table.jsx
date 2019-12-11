import React                  from 'react';
import PropTypes              from 'prop-types';
import { Table, Button }      from 'deriv-components';
import { MockWS }             from 'Utils/websocket';
import { localize }           from 'Components/i18next';
import { InfiniteLoaderList } from 'Components/table/infinite-loader-list.jsx';
import { TableDimensions }    from 'Components/table/table-dimensions.jsx';
import { MyAdsLoader }        from './my-ads-loader.jsx';

const headers = [
    { text: localize('Ad ID')  },
    { text: localize('Amount') },
    { text: localize('Price') },
    { text: localize('Min transaction') },
];

const type = {
    buy: localize('Buy'),
    sell: localize('Sell'),
}

const RowComponent = React.memo(({ data, style }) => (
    <div style={style}>
        <Table.Row>
            <Table.Cell>{type[data.type]}<br />{data.offer_id}</Table.Cell>
            <Table.Cell>{data.amount}</Table.Cell>
            <Table.Cell>{data.price}</Table.Cell>
            <Table.Cell>{data.min_transaction}</Table.Cell>
        </Table.Row>
    </div>
));
RowComponent.propTypes = {
    data : PropTypes.object,
    style: PropTypes.object,
};
RowComponent.displayName = 'RowComponent';

export class MyAdsTable extends React.Component {
    // TODO: Find a better solution for handling no-op instead of using is_mounted flags
    is_mounted = false;

    state = {
        items: [],
    };

    table_container_ref = React.createRef();

    componentDidMount() {
        this.is_mounted = true;

        MockWS({ p2p_offer_list: 1, type: 'buy' }).then((response) => {
            // TODO [p2p-replace-api] p2p agent details should be the one retrieve the agent id
            const filtered_response = response.filter(offer => offer.advertiser_id === 'ABC123');

            if (this.is_mounted) {
                this.setState({ items: filtered_response, is_loading: false });
            }
        });
    }

    componentWillUnmount() {
        this.is_mounted = false;
    }

    render() {
        const { items } = this.state;

        return (
            <div ref={this.table_container_ref}>
                <Table>
                    <Table.Header>
                        <Table.Row>
                            {headers.map(header =>
                                <Table.Head key={header.text}>{header.text}</Table.Head>)}
                        </Table.Row>
                    </Table.Header>
                    <Table.Body>
                        <TableDimensions>
                            {dimensions =>
                                <InfiniteLoaderList
                                    items={items}
                                    RenderComponent={RowComponent}
                                    RowLoader={MyAdsLoader}
                                    width={dimensions.width}
                                    heigh={dimensions.height}
                                />
                            }
                        </TableDimensions>
                    </Table.Body>
                </Table>
            </div>
        );
    }
}
