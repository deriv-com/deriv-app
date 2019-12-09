import React                  from 'react';
import PropTypes              from 'prop-types';
import { Table, Button, Loading }      from 'deriv-components';
import { localize }           from 'deriv-translations';
import { InfiniteLoaderList } from '../table/infinite-loader-list.jsx';
import { TableDimensions }    from '../table/table-dimensions.jsx';

// TODO: replace with API response
const mock_response = {
    advertiser     : 'John Doe',
    price          : 'IRD 2,000,000.00',
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
            <Table.Cell>{data.currency}{' '}{data.amount}</Table.Cell>
            <Table.Cell>{data.price}</Table.Cell>
            <Table.Cell>{data.currency}{' '}{data.min_transaction}</Table.Cell>
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

export const BuySellTable = ({ table, setSelectedAd }) => {
    if (table === 'buy') return <BuyTable setSelectedAd={setSelectedAd} />;
    return <SellTable setSelectedAd={setSelectedAd} />;
};
BuySellTable.propTypes = {
    table        : PropTypes.string,
    setSelectedAd: PropTypes.func,
};

class SellTable extends React.Component {
    state = {
        items                 : null,
        is_loading_more_items : false,
        has_more_items_to_load: true,
        is_loading            : true,
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

    componentDidMount() {
        setTimeout(() => {
            this.setState({ items: initial_data, is_loading: false });
        }, 1000);
    }

    render() {
        const { items, is_loading_more_items, has_more_items_to_load, is_loading } = this.state;
        const { setSelectedAd } = this.props;

        const Row = props => <RowComponent {...props} is_buy={false} setSelectedAd={setSelectedAd} />;

        if (is_loading) return <Loading is_fullscreen={false} />;

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

SellTable.propTypes = {
    setSelectedAd: PropTypes.func,
};

class BuyTable extends React.Component {
    state = {
        items                 : null,
        is_loading_more_items : false,
        has_more_items_to_load: true,
        is_loading            : true,
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

    componentDidMount() {
        setTimeout(() => {
            this.setState({ items: initial_data, is_loading: false });
        }, 1000);
    }

    render() {
        const { items, is_loading_more_items, has_more_items_to_load, is_loading } = this.state;
        const { setSelectedAd } = this.props;
        const Row = props => <RowComponent {...props} is_buy={true} setSelectedAd={setSelectedAd} />;
    
        if (is_loading) return <Loading is_fullscreen={false} />;

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

BuyTable.propTypes = {
    setSelectedAd: PropTypes.func,
};
