import classNames from 'classnames';
import React from 'react';
import PropTypes from 'prop-types';
import { Button, InfiniteDataList, Loading, Table } from '@deriv/components';
import { observer } from 'mobx-react-lite';
import { localize } from 'Components/i18next';
import Empty from 'Components/empty/empty.jsx';
import ToggleAds from 'Components/my-ads/toggle-ads.jsx';
import Popup from 'Components/orders/popup.jsx';
import { TableError } from 'Components/table/table-error.jsx';
import { useStores } from 'Stores';
import MyAdsRowRenderer from './my-ads-row-renderer.jsx';

const getHeaders = offered_currency => [
    { text: localize('Ad ID') },
    { text: localize('Limits') },
    { text: localize('Rate (1 {{ offered_currency }})', { offered_currency }) },
    { text: localize('Available amount') },
    { text: '' }, // empty header for delete icon
];

const MyAdsTable = observer(() => {
    const { general_store, my_ads_store } = useStores();

    React.useEffect(() => {
        my_ads_store.setIsTableLoading(true);
        my_ads_store.setAdverts([]);
        my_ads_store.loadMoreAds({ startIndex: 0 });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    if (my_ads_store.is_table_loading) {
        return <Loading is_fullscreen={false} />;
    }

    if (my_ads_store.api_error_message) {
        return <TableError message={my_ads_store.api_error_message} />;
    }

    if (my_ads_store.adverts.length) {
        return (
            <React.Fragment>
                <div className='p2p-my-ads__header'>
                    <Button large primary onClick={my_ads_store.onClickCreate}>
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
                    <Table.Body className='p2p-my-ads__table-body'>
                        <InfiniteDataList
                            data_list_className='p2p-my-ads__data-list'
                            items={my_ads_store.adverts}
                            rowRenderer={row_props => <MyAdsRowRenderer {...row_props} />}
                            has_more_items_to_load={my_ads_store.has_more_items_to_load}
                            loadMoreRowsFn={my_ads_store.loadMoreAds}
                            keyMapperFn={item => item.id}
                        />
                    </Table.Body>
                </Table>
                <Popup
                    cancel_text={localize('Cancel')}
                    confirm_text={localize('Delete')}
                    has_cancel
                    message={localize('You will NOT be able to restore it.')}
                    onCancel={my_ads_store.onClickCancel}
                    onClickConfirm={my_ads_store.onClickConfirm}
                    setShouldShowPopup={my_ads_store.setShouldShowPopup}
                    should_show_popup={my_ads_store.should_show_popup}
                    title={localize('Do you want to delete this ad?')}
                />
            </React.Fragment>
        );
    }

    return (
        <Empty icon='IcCashierNoAds' title={localize('You have no adverts')}>
            <Button primary large className='p2p-empty__button' onClick={() => my_ads_store.onClickCreate()}>
                {localize('Create new ad')}
            </Button>
        </Empty>
    );
});

MyAdsTable.propTypes = {
    adverts: PropTypes.array,
    api_table_error_message: PropTypes.string,
    client: PropTypes.object,
    has_more_items_to_load: PropTypes.bool,
    height_values: PropTypes.array,
    is_listed: PropTypes.bool,
    item_height: PropTypes.number,
    item_offset: PropTypes.number,
    loadMoreAds: PropTypes.func,
    onClickCancel: PropTypes.func,
    onClickConfirm: PropTypes.func,
    onClickCreate: PropTypes.func,
    onClickDelete: PropTypes.func,
    setShouldShowPopup: PropTypes.func,
    should_show_popup: PropTypes.bool,
};

export default MyAdsTable;
