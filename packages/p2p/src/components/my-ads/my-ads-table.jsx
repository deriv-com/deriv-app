import classNames from 'classnames';
import React from 'react';
import PropTypes from 'prop-types';
import { Button, Icon, Loading, Table, ProgressIndicator } from '@deriv/components';
import { useIsMounted } from '@deriv/shared';
import { observer } from 'mobx-react-lite';
import { localize, Localize } from 'Components/i18next';
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
    { text: localize('Available amount') },
    { text: '' }, // empty header for delete icon
];

const type = {
    buy: <Localize i18n_default_text='Buy' />,
    sell: <Localize i18n_default_text='Sell' />,
};

const RowComponent = React.memo(({ data: advert, row_actions, style }) => {
    const {
        account_currency,
        amount,
        amount_display,
        local_currency,
        max_order_amount_display,
        min_order_amount_display,
        price_display,
        remaining_amount,
        remaining_amount_display,
    } = advert;

    return (
        <div style={style}>
            <Table.Row className='p2p-my-ads__table-row'>
                <Table.Cell>
                    {type[advert.type]} {advert.id}
                </Table.Cell>
                <Table.Cell>
                    {min_order_amount_display}-{max_order_amount_display} {account_currency}
                </Table.Cell>
                <Table.Cell className='p2p-my-ads__table-price'>
                    {price_display} {local_currency}
                </Table.Cell>
                <Table.Cell className='p2p-my-ads__table-available'>
                    <ProgressIndicator
                        className={'p2p-my-ads__table-available-progress'}
                        value={remaining_amount}
                        total={amount}
                    />
                    <div className='p2p-my-ads__table-available-value'>
                        {remaining_amount_display}/{amount_display} {account_currency}
                    </div>
                </Table.Cell>
                <Table.Cell className='p2p-my-ads__table-delete'>
                    <Icon icon='IcDelete' size={16} onClick={() => row_actions.onClickDelete(advert.id)} />
                </Table.Cell>
            </Table.Row>
        </div>
    );
});

RowComponent.propTypes = {
    advert: PropTypes.object,
    style: PropTypes.object,
};
RowComponent.displayName = 'RowComponent';

const MyAdsTable = observer(({ onClickCreate }) => {
    const { general_store } = useStores();
    const item_offset = React.useRef(0);
    const [adverts, setAdverts] = React.useState([]);
    const [api_error_message, setApiErrorMessage] = React.useState('');
    const [has_more_items_to_load, setHasMoreItemsToLoad] = React.useState(false);
    const [is_loading, setIsLoading] = React.useState(false);
    const [selected_ad_id, setSelectedAdId] = React.useState('');
    const [should_show_popup, setShouldShowPopup] = React.useState(false);
    const isMounted = useIsMounted();

    React.useEffect(() => {
        if (isMounted()) {
            setIsLoading(true);
            loadMoreAds(item_offset.current);
        }
    }, []);

    const loadMoreAds = start_idx => {
        const { list_item_limit } = general_store;

        return new Promise(resolve => {
            requestWS({
                p2p_advertiser_adverts: 1,
                offset: start_idx,
                limit: list_item_limit,
            }).then(response => {
                if (isMounted()) {
                    if (!response.error) {
                        const { list } = response.p2p_advertiser_adverts;
                        setHasMoreItemsToLoad(list.length >= list_item_limit);
                        setAdverts(adverts.concat(list));
                        item_offset.current += list.length;
                    } else {
                        setApiErrorMessage(response.error.message);
                    }
                    setIsLoading(false);
                }
                resolve();
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
            if (isMounted()) {
                if (response.error) {
                    showError({ error_message: response.error.message });
                } else {
                    // remove the deleted ad from the list of items
                    const updated_items = adverts.filter(ad => ad.id !== response.p2p_advert_update.id);
                    setAdverts(updated_items);
                    setShouldShowPopup(false);
                }
            }
        });
    };

    if (is_loading) {
        return <Loading is_fullscreen={false} />;
    }
    if (api_error_message) {
        return <TableError message={api_error_message} />;
    }

    if (adverts.length) {
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
                            items={adverts.slice()}
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
                    message={localize('You will NOT be able to restore it.')}
                    onCancel={onClickCancel}
                    onClickConfirm={onClickConfirm}
                    setShouldShowPopup={setShouldShowPopup}
                    should_show_popup={should_show_popup}
                    title={localize('Do you want to delete this ad?')}
                />
            </React.Fragment>
        );
    }

    return (
        <Empty icon='IcCashierNoAds' title={localize('You have no adverts')}>
            <Button primary large className='p2p-empty__button' onClick={() => onClickCreate()}>
                {localize('Create new ad')}
            </Button>
        </Empty>
    );
});

MyAdsTable.propTypes = {
    onClickCreate: PropTypes.func,
};

export default MyAdsTable;
