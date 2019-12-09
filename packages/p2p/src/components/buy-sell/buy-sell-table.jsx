import React                  from 'react';
import PropTypes              from 'prop-types';
import { Table, Button }      from 'deriv-components';
import { localize }           from 'deriv-translations';
import { InfiniteLoaderList } from '../table/infinite-loader-list.jsx';
import { TableDimensions }    from '../table/table-dimensions.jsx';

// TODO: replace with API response
const mock_response = {
    advertiser     : 'John Doe',
    amount         : 'BTC 10.12345678',
    price          : 'IRD 2,000,000.00',
    min_transaction: 'IRD 10,000.00',
    payment_method : 'Bank transfer',
    type           : 'buy',
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

const headers = [
    { text: localize('Advertisers')  },
    { text: localize('Amount') },
    { text: localize('Price for 1 BTC') },
    { text: localize('Min transaction') },
    { text: localize('Payment Method') },
    { text: localize('Trade') },
];

const RowComponent = React.memo(({ data, style, is_buy, setSelectedAd }) => (
    <div style={style}>
        <Table.Row>
            <Table.Cell>{data.advertiser}</Table.Cell>
            <Table.Cell>{data.amount}</Table.Cell>
            <Table.Cell>{data.price}</Table.Cell>
            <Table.Cell>{data.min_transaction}</Table.Cell>
            <Table.Cell>{data.payment_method}</Table.Cell>
            <Table.Cell>
                <Button primary small onClick={() => setSelectedAd(data)}>
                    {is_buy ? localize('Buy') : localize('Sell')}
                </Button>
            </Table.Cell>
        </Table.Row>
    </div>
));
RowComponent.propTypes = {
    data         : PropTypes.object,
    style        : PropTypes.object,
    is_buy       : PropTypes.bool,
    setSelectedAd: PropTypes.func,
};
RowComponent.displayName = 'RowComponent';

export class BuySellTable extends React.Component {
    state = {
        items                 : initial_data,
        is_loading_more_items : false,
        has_more_items_to_load: true,
    };
    
    loadMore = () => {
        // Check with type if sell or buy data should be loaded
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
        const { setSelectedAd } = this.props;
        const is_buy = items[0].type === 'buy';

        const Row = props => <RowComponent {...props} is_buy={is_buy} setSelectedAd={setSelectedAd} />;

        return (
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
                                is_loading_more_items={is_loading_more_items}
                                loadMore={this.loadMore}
                                has_more_items_to_load={has_more_items_to_load}
                                RenderComponent={Row}
                                width={dimensions.width}
                                height={dimensions.height}
                            />
                        }
                    </TableDimensions>
                </Table.Body>
            </Table>
        );
    }
}

BuySellTable.propTypes = {
    setSelectedAd: PropTypes.func,
};
