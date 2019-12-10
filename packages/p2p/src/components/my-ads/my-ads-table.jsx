import React                  from 'react';
import PropTypes              from 'prop-types';
import { Table, Button }      from 'deriv-components';
import { MyAdsLoader }        from './my-ads-loader.jsx';
import { localize }           from '../i18next';
import { InfiniteLoaderList } from '../table/infinite-loader-list.jsx';
import { TableDimensions }    from '../table/table-dimensions.jsx';

// TODO: replace with API response
const mock_response = {
    ad_id          : 'Buy 000023434',
    amount         : 'BTC 0.00001234',
    price          : '34,000 MYR/BTC',
    min_transaction: 'MYR 50',
    payment_method : 'Bank transfer',
};
const initial_data = [
    { ...mock_response },
    { ...mock_response },
    { ...mock_response },
    { ...mock_response },
];

const getMockData = () => {
    return new Promise((resolve) => {
        setTimeout(function() {
            resolve([
                { ...mock_response }, { ...mock_response }, { ...mock_response }, { ...mock_response },
            ]);
        }, 300);
    });
};

const headers = [
    { text: localize('Ad ID')  },
    { text: localize('Amount') },
    { text: localize('Price') },
    { text: localize('Min transaction') },
    { text: localize('Payment Method') },
];

const RowComponent = React.memo(({ data, style }) => (
    <div style={style}>
        <Table.Row>
            <Table.Cell>{data.ad_id}</Table.Cell>
            <Table.Cell>{data.amount}</Table.Cell>
            <Table.Cell>{data.price}</Table.Cell>
            <Table.Cell>{data.min_transaction}</Table.Cell>
            <Table.Cell>{data.payment_method}</Table.Cell>
            <Table.Cell>
                <div style={{
                    marginRight: '0.9rem',
                }}
                >
                    <Button secondary small>{localize('Edit')}</Button>
                </div>
                <Button secondary small>{localize('Delete')}</Button>
            </Table.Cell>
        </Table.Row>
    </div>
));
RowComponent.propTypes = {
    data : PropTypes.object,
    style: PropTypes.object,
};
RowComponent.displayName = 'RowComponent';

export class MyAdsTable extends React.Component {
    state = {
        items                 : initial_data,
        is_loading_more_items : false,
        has_more_items_to_load: true,
    };

    table_container_ref = React.createRef();
    
    loadMore = () => {
        this.setState({ is_loading_more_items: true }, () => {
            getMockData().then((res) => {
                this.setState({
                    is_loading_more_items: false,
                    items                : [...this.state.items, ...res],
                });
            });
        });
    }

    render() {
        const { items, is_loading_more_items, has_more_items_to_load } = this.state;

        return (
            <div ref={this.table_container_ref}>
                <Table>
                    <Table.Header>
                        <Table.Row>
                            {headers.map(header =>
                                <Table.Head key={header.text}>{header.text}</Table.Head>)}
                            <Table.Head />
                        </Table.Row>
                    </Table.Header>
                    <Table.Body>
                        <TableDimensions>
                            {dimensions =>
                                <InfiniteLoaderList
                                    items={items}
                                    is_loading_more_items={is_loading_more_items}
                                    loadMore={this.loadMore}
                                    has_more_items_to_load={has_more_items_to_load}
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
