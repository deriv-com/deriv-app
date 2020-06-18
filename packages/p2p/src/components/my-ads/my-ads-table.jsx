import classNames from 'classnames';
import React from 'react';
import PropTypes from 'prop-types';
import { Button, Dialog, Icon, Loading, Table, ProgressIndicator } from '@deriv/components';
import { localize, Localize } from 'Components/i18next';
import Dp2pContext from 'Components/context/dp2p-context';
import { InfiniteLoaderList } from 'Components/table/infinite-loader-list.jsx';
import { TableError } from 'Components/table/table-error.jsx';
import { requestWS } from 'Utils/websocket';
import { MyAdsLoader } from './my-ads-loader.jsx';
import ToggleAds from './toggle-ads.jsx';
import Popup from '../orders/popup.jsx';

const getHeaders = offered_currency => [
    { text: localize('Ad ID') },
    { text: localize('Limits') },
    { text: localize('Rate (1 {{ offered_currency }})', { offered_currency }) },
    { text: localize('Payment method') },
    { text: localize('Available amount') },
    { text: '' }, // empty header for delete icon
];

const type = {
    buy: localize('Buy'),
    sell: localize('Sell'),
};

const RowComponent = React.memo(({ data, row_actions, style }) => (
    <div style={style}>
        <Table.Row className='p2p-my-ads__table-row'>
            <Table.Cell>
                {type[data.type]} {data.id}
            </Table.Cell>
            <Table.Cell>
                {data.display_min_order_amount}-{data.display_max_order_amount} {data.offer_currency}
            </Table.Cell>
            <Table.Cell className='p2p-my-ads__table-price'>
                {data.display_price_rate} {data.transaction_currency}
            </Table.Cell>
            <Table.Cell>{data.display_payment_method}</Table.Cell>
            <Table.Cell className='p2p-my-ads__table-available'>
                <ProgressIndicator
                    className={'p2p-my-ads__table-available-progress'}
                    value={data.available_amount}
                    total={data.offer_amount}
                />
                <div className='p2p-my-ads__table-available-value'>
                    {data.display_available_amount}/{data.display_offer_amount} {data.offer_currency}
                </div>
            </Table.Cell>
            <Table.Cell className='p2p-my-ads__table-delete'>
                <Icon icon='IcDelete' size={16} onClick={() => row_actions.onClickDelete(data.id)} />
            </Table.Cell>
        </Table.Row>
    </div>
));

RowComponent.propTypes = {
    data: PropTypes.object,
    style: PropTypes.object,
};
RowComponent.displayName = 'RowComponent';

const MyAdsTable = ({ onClickCreate }) => {
    const { currency, list_item_limit, is_advertiser, is_listed } = React.useContext(Dp2pContext);
    const mounted = React.useRef(false);
    const item_offset = React.useRef(0);
    const [is_loading, setIsLoading] = React.useState(true);
    const [api_error_message, setApiErrorMessage] = React.useState('');
    const [has_more_items_to_load, setHasMoreItemsToLoad] = React.useState(false);
    const [selected_ad_id, setSelectedAdId] = React.useState('');
    const [show_popup, setShowPopup] = React.useState(false);
    const [ads, setAds] = React.useState([]);

    React.useEffect(() => {
        mounted.current = true;
        loadMoreAds(item_offset.current);

        return () => (mounted.current = false);
    }, []);

    const loadMoreAds = start_idx => {
        return new Promise(resolve => {
            requestWS({
                p2p_advertiser_adverts: 1,
                offset: start_idx,
                limit: list_item_limit,
            }).then(response => {
                if (mounted.current) {
                    if (!response.error) {
                        setHasMoreItemsToLoad(response.length >= list_item_limit);
                        setAds(ads.concat(response));
                        setIsLoading(false);
                        item_offset.current += response.length;
                    } else {
                        setApiErrorMessage(response.api_error_message);
                    }
                    resolve();
                }
            });
        });
    };

    const onClickDelete = id => {
        setSelectedAdId(id);
        setShowPopup(true);
    };

    const onClickCancel = () => {
        setSelectedAdId('');
        setShowPopup(false);
    };

    const onClickConfirm = showError => {
        requestWS({ p2p_advert_update: 1, id: selected_ad_id, delete: 1 }).then(response => {
            if (response.error) {
                showError({ error_message: response.error.message });
            } else {
                // remove the deleted ad from the list of items
                const updated_items = ads.filter(ad => ad.id !== response.p2p_advert_update.id);
                setAds(updated_items);
                setShowPopup(false);
            }
        });
    };

    if (is_loading) {
        return <Loading is_fullscreen={false} />;
    }
    if (api_error_message) {
        return <TableError message={api_error_message} />;
    }

    if (ads.length) {
        const item_height = 56;
        const height_values = {
            screen_size: '100vh',
            header_size: '48px',
            page_overlay_header: '53px',
            page_overlay_content_padding: '2.4rem',
            tabs_height: '36px',
            my_ads_header: '50px',
            my_ads_header_margin: '4rem', // 1.6rem + 2.4rem
            table_header_height: '50px',
            footer_size: '37px',
        };
        return (
            <React.Fragment>
                <div className='p2p-my-ads__header'>
                    <Button large primary onClick={onClickCreate}>
                        {localize('Create new ad')}
                    </Button>
                    <ToggleAds />
                </div>
                <Table
                    className={classNames('p2p-my-ads__table', {
                        'p2p-my-ads__table--disabled': !is_listed,
                    })}
                >
                    <Table.Header>
                        <Table.Row className='p2p-my-ads__table-row'>
                            {getHeaders(currency).map(header => (
                                <Table.Head key={header.text}>{header.text}</Table.Head>
                            ))}
                        </Table.Row>
                    </Table.Header>
                    <Table.Body>
                        <InfiniteLoaderList
                            autosizer_height={`calc(${Object.values(height_values).join(' - ')})`}
                            items={ads.slice()}
                            item_size={item_height}
                            row_actions={{ onClickDelete }}
                            RenderComponent={RowComponent}
                            RowLoader={MyAdsLoader}
                            has_more_items_to_load={has_more_items_to_load}
                            loadMore={loadMoreAds}
                        />
                    </Table.Body>
                </Table>
                {show_popup && (
                    <div className='orders__dialog'>
                        <Dialog is_visible={!!show_popup}>
                            <Popup
                                has_cancel
                                title={localize('Delete this ad')}
                                message={localize("You won't be able to restore it later.")}
                                cancel_text={localize('Cancel')}
                                confirm_text={localize('Delete')}
                                onCancel={onClickCancel}
                                onClickConfirm={onClickConfirm}
                            />
                        </Dialog>
                    </div>
                )}
            </React.Fragment>
        );
    }

    return (
        <div className='p2p-cashier__empty'>
            <Icon icon='IcCashierNoAds' className='p2p-cashier__empty-icon' size={128} />
            <div className='p2p-cashier__empty-title'>
                <Localize i18n_default_text='You have no ads' />
            </div>
            <Button primary large className='p2p-cashier__empty-button' onClick={() => onClickCreate()}>
                {localize('Create new ad')}
            </Button>
        </div>
    );
};

MyAdsTable.propTypes = {
    is_enabled: PropTypes.bool,
};

export default MyAdsTable;
