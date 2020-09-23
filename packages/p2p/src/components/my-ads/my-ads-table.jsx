import classNames from 'classnames';
import React from 'react';
import PropTypes from 'prop-types';
import { Button, Icon, Loading, Table, ProgressIndicator } from '@deriv/components';
import { localize } from 'Components/i18next';
import Empty from 'Components/empty/empty.jsx';
import ToggleAds from 'Components/my-ads/toggle-ads.jsx';
import Popup from 'Components/orders/popup.jsx';
import { InfiniteLoaderList } from 'Components/table/infinite-loader-list.jsx';
import { TableError } from 'Components/table/table-error.jsx';
import { height_constants } from 'Utils/height_constants';
import { requestWS } from 'Utils/websocket';
import { MyAdsLoader } from './my-ads-loader.jsx';
import { useStores } from '../../../stores';

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
    const { general_store } = useStores();
    const is_mounted = React.useRef(false);
    const item_offset = React.useRef(0);
    const [is_loading, setIsLoading] = React.useState(true);
    const [api_error_message, setApiErrorMessage] = React.useState('');
    const [has_more_items_to_load, setHasMoreItemsToLoad] = React.useState(false);
    const [selected_ad_id, setSelectedAdId] = React.useState('');
    const [should_show_popup, setShouldShowPopup] = React.useState(false);
    const [ads, setAds] = React.useState([]);

    React.useEffect(() => {
        is_mounted.current = true;
        loadMoreAds(item_offset.current);

        return () => (is_mounted.current = false);
    }, []);

    const loadMoreAds = start_idx => {
        return new Promise(resolve => {
            requestWS({
                p2p_advertiser_adverts: 1,
                offset: start_idx,
                limit: general_store.list_item_limit,
            }).then(response => {
                if (is_mounted.current) {
                    if (!response.error) {
                        setHasMoreItemsToLoad(response.length >= general_store.list_item_limit);
                        setAds(ads.concat(response));
                        item_offset.current += response.length;
                    } else {
                        setApiErrorMessage(response.api_error_message);
                    }
                    setIsLoading(false);
                    resolve();
                }
            });
        });
    };

    const onClickDelete = id => {
        setSelectedAdId(id);
        setShouldShowPopup(true);
    };

    const onClickCancel = () => {
        setSelectedAdId('');
        setShouldShowPopup(false);
    };

    const onClickConfirm = showError => {
        requestWS({ p2p_advert_update: 1, id: selected_ad_id, delete: 1 }).then(response => {
            if (response.error) {
                showError({ error_message: response.error.message });
            } else {
                // remove the deleted ad from the list of items
                const updated_items = ads.filter(ad => ad.id !== response.p2p_advert_update.id);
                setAds(updated_items);
                setShouldShowPopup(false);
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
        const height_values = [
            height_constants.screen,
            height_constants.core_header,
            height_constants.page_overlay_header,
            height_constants.page_overlay_content_padding,
            height_constants.tabs,
            '50px', // p2p-my-ads__header
            '4rem', // p2p-my-ads__header: 1.6rem + 2.4rem
            height_constants.table_header,
            height_constants.core_footer,
        ];
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
                        'p2p-my-ads__table--disabled': !general_store.is_listed,
                    })}
                >
                    <Table.Header>
                        <Table.Row className='p2p-my-ads__table-row'>
                            {getHeaders(general_store.client.currency).map(header => (
                                <Table.Head key={header.text}>{header.text}</Table.Head>
                            ))}
                        </Table.Row>
                    </Table.Header>
                    <Table.Body>
                        <InfiniteLoaderList
                            autosizer_height={`calc(${height_values.join(' - ')})`}
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
                <Popup
                    cancel_text={localize('Cancel')}
                    confirm_text={localize('Delete')}
                    has_cancel
                    message={localize("You won't be able to restore it later.")}
                    onCancel={onClickCancel}
                    onClickConfirm={onClickConfirm}
                    setShouldShowPopup={setShouldShowPopup}
                    should_show_popup={should_show_popup}
                    title={localize('Delete this ad')}
                />
            </React.Fragment>
        );
    }

    return (
        <Empty icon='IcCashierNoAds' title={localize('You have no ads')}>
            <Button primary large className='p2p-empty__button' onClick={() => onClickCreate()}>
                {localize('Create new ad')}
            </Button>
        </Empty>
    );
};

MyAdsTable.propTypes = {
    onClickCreate: PropTypes.func,
};

export default MyAdsTable;
