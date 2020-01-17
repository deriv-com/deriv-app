import React                  from 'react';
import PropTypes              from 'prop-types';
import { Table }              from '@deriv/components';
import Dp2pContext            from 'Components/context/dp2p-context';
import { localize }           from 'Components/i18next';
import { InfiniteLoaderList } from 'Components/table/infinite-loader-list.jsx';
import { requestWS }          from 'Utils/websocket';
import { MyAdsLoader }        from './my-ads-loader.jsx';

const headers = [
    { text: localize('Ad ID')  },
    { text: localize('Available') },
    { text: localize('Limits') },
    { text: localize('Price') },
    { text: localize('Payment method') },
];

const type = {
    buy : localize('Buy'),
    sell: localize('Sell'),
};

const RowComponent = React.memo(({ data, style }) => (
    <div style={style}>
        <Table.Row>
            <Table.Cell><div>{type[data.type]}<div className='p2p-my-ads__table-id'>{data.offer_id}</div></div></Table.Cell>
            <Table.Cell>{data.display_available_amount}{' '}{data.offer_currency}</Table.Cell>
            <Table.Cell>{data.display_min_transaction}-{data.display_max_transaction}{' '}{data.offer_currency}</Table.Cell>
            <Table.Cell className='p2p-my-ads__table-price'>{data.display_price_rate}{' '}{data.transaction_currency}</Table.Cell>
            <Table.Cell>{data.payment_method}</Table.Cell>
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

        requestWS({ p2p_offer_list: 1, agent_id: this.context.agent_id }).then((response) => {
            if (this.is_mounted) {
                this.setState({ items: response, is_loading: false });
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
                        <InfiniteLoaderList
                            items={items}
                            RenderComponent={RowComponent}
                            RowLoader={MyAdsLoader}
                        />
                    </Table.Body>
                </Table>
            </div>
        );
    }
}

MyAdsTable.contextType = Dp2pContext;
