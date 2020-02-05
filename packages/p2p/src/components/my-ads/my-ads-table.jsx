import React from 'react';
import PropTypes from 'prop-types';
import { Button, Dialog, Table } from '@deriv/components';
import Dp2pContext from 'Components/context/dp2p-context';
import { localize } from 'Components/i18next';
import { InfiniteLoaderList } from 'Components/table/infinite-loader-list.jsx';
import { requestWS } from 'Utils/websocket';
import { MyAdsLoader } from './my-ads-loader.jsx';
import Popup from '../orders/popup.jsx';

const headers = [
    { text: localize('Ad ID') },
    { text: localize('Available') },
    { text: localize('Limits') },
    { text: localize('Price') },
    { text: localize('Payment method') },
    { text: localize('Actions') },
];

const type = {
    buy: localize('Buy'),
    sell: localize('Sell'),
};

const RowComponent = React.memo(({ data, row_actions, style }) => (
    <div style={style}>
        <Table.Row>
            <Table.Cell>
                {type[data.type]} {data.offer_id}
            </Table.Cell>
            <Table.Cell>
                {data.display_available_amount} {data.offer_currency}
            </Table.Cell>
            <Table.Cell>
                {data.display_min_transaction}-{data.display_max_transaction} {data.offer_currency}
            </Table.Cell>
            <Table.Cell className='p2p-my-ads__table-price'>
                {data.display_price_rate} {data.transaction_currency}
            </Table.Cell>
            <Table.Cell>{data.display_payment_method}</Table.Cell>
            <Table.Cell>
                <Button secondary small onClick={() => row_actions.onClickDelete(data.offer_id)}>
                    {localize('Delete')}
                </Button>
            </Table.Cell>
        </Table.Row>
    </div>
));
RowComponent.propTypes = {
    data: PropTypes.object,
    style: PropTypes.object,
};
RowComponent.displayName = 'RowComponent';

export class MyAdsTable extends React.Component {
    // TODO: Find a better solution for handling no-op instead of using is_mounted flags
    is_mounted = false;

    state = {
        items: [],
        selected_ad_id: '',
        show_popup: false,
    };

    table_container_ref = React.createRef();

    componentDidMount() {
        this.is_mounted = true;

        requestWS({ p2p_offer_list: 1, agent_id: this.context.advertiser_id }).then(response => {
            if (this.is_mounted) {
                this.setState({ items: response, is_loading: false });
            }
        });
    }

    componentWillUnmount() {
        this.is_mounted = false;
    }

    onClickDelete = offer_id => {
        this.setState({ selected_ad_id: offer_id, show_popup: true });
    };

    onClickCancel = () => {
        this.setState({ selected_ad_id: '', show_popup: false });
    };

    onClickConfirm = showError => {
        requestWS({ p2p_offer_update: 1, offer_id: this.state.selected_ad_id, is_active: 0 }).then(response => {
            if (response.error) {
                showError({ error_message: response.error.message });
            } else {
                // remove the deleted ad from the list of items
                const updated_items = this.state.items.filter(ad => ad.offer_id !== response.p2p_offer_update.offer_id);
                this.setState({ items: updated_items, show_popup: false });
            }
        });
    };

    render() {
        const { items } = this.state;

        return (
            <div ref={this.table_container_ref}>
                <Table>
                    <Table.Header>
                        <Table.Row>
                            {headers.map(header => (
                                <Table.Head key={header.text}>{header.text}</Table.Head>
                            ))}
                        </Table.Row>
                    </Table.Header>
                    <Table.Body>
                        {items.length ? (
                            <InfiniteLoaderList
                                items={items}
                                row_actions={{ onClickDelete: this.onClickDelete }}
                                RenderComponent={RowComponent}
                                RowLoader={MyAdsLoader}
                            />
                        ) : (
                            <div className='deriv-p2p__empty'>{localize("You haven't posted any ads yet")}</div>
                        )}
                    </Table.Body>
                </Table>
                {this.state.show_popup && (
                    <div className='orders__dialog'>
                        <Dialog is_visible={!!this.state.show_popup}>
                            <Popup
                                has_cancel
                                title={localize('Delete this ad')}
                                message={localize("You won't be able to restore it later.")}
                                cancel_text={localize('Cancel')}
                                confirm_text={localize('Delete')}
                                onCancel={this.onClickCancel}
                                onClickConfirm={this.onClickConfirm}
                            />
                        </Dialog>
                    </div>
                )}
            </div>
        );
    }
}

MyAdsTable.contextType = Dp2pContext;
