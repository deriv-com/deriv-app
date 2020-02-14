import React from 'react';
import PropTypes from 'prop-types';
import { Button, Dialog, Loading, Table } from '@deriv/components';
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
    { text: '' }, // empty header
];

const type = {
    buy: localize('Buy'),
    sell: localize('Sell'),
};

const RowComponent = React.memo(({ data, row_actions, style }) => (
    <div style={style}>
        <Table.Row>
            <Table.Cell>
                {type[data.type]} {data.id}
            </Table.Cell>
            <Table.Cell>
                {data.display_available_amount} {data.offer_currency}
            </Table.Cell>
            <Table.Cell>
                {data.display_min_available}-{data.display_max_available} {data.offer_currency}
            </Table.Cell>
            <Table.Cell className='p2p-my-ads__table-price'>
                {data.display_price_rate} {data.transaction_currency}
            </Table.Cell>
            <Table.Cell>{data.display_payment_method}</Table.Cell>
            <Table.Cell>
                <Button
                    className='deriv-p2p__button--right-aligned'
                    secondary
                    small
                    onClick={() => row_actions.onClickDelete(data.id)}
                >
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
        is_loading: true,
        items: [],
        selected_ad_id: '',
        show_popup: false,
    };

    table_container_ref = React.createRef();

    componentDidMount() {
        this.is_mounted = true;

        requestWS({ p2p_advertiser_adverts: 1 }).then(response => {
            if (this.is_mounted) {
                this.setState({ items: response, is_loading: false });
            }
        });
    }

    componentWillUnmount() {
        this.is_mounted = false;
    }

    onClickDelete = id => {
        this.setState({ selected_ad_id: id, show_popup: true });
    };

    onClickCancel = () => {
        this.setState({ selected_ad_id: '', show_popup: false });
    };

    onClickConfirm = showError => {
        requestWS({ p2p_advert_update: 1, id: this.state.selected_ad_id, is_active: 0 }).then(response => {
            if (response.error) {
                showError({ error_message: response.error.message });
            } else {
                // remove the deleted ad from the list of items
                const updated_items = this.state.items.filter(ad => ad.id !== response.p2p_advert_update.id);
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
                    {this.state.is_loading ? (
                        <Loading is_fullscreen={false} />
                    ) : (
                        <Table.Body>
                            {items.length ? (
                                <InfiniteLoaderList
                                    items={items}
                                    row_actions={{ onClickDelete: this.onClickDelete }}
                                    RenderComponent={RowComponent}
                                    RowLoader={MyAdsLoader}
                                />
                            ) : (
                                <div className='deriv-p2p__empty'>{localize("You haven't posted any ads yet.")}</div>
                            )}
                        </Table.Body>
                    )}
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
