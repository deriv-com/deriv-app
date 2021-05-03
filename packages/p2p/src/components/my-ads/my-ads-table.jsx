import classNames from 'classnames';
import React from 'react';
import { Button, InfiniteDataList, Loading, Table } from '@deriv/components';
import { isDesktop, isMobile } from '@deriv/shared';
import { observer } from 'mobx-react-lite';
import { localize } from 'Components/i18next';
import Empty from 'Components/empty/empty.jsx';
import ToggleAds from 'Components/my-ads/toggle-ads.jsx';
import { TableError } from 'Components/table/table-error.jsx';
import { useStores } from 'Stores';
import MyAdsDeleteModal from './my-ads-delete-modal.jsx';
import MyAdsRowRenderer from './my-ads-row-renderer.jsx';

const getHeaders = offered_currency => [
    { text: localize('Ad ID') },
    { text: localize('Limits') },
    { text: localize('Rate (1 {{ offered_currency }})', { offered_currency }) },
    { text: localize('Available amount') },
    { text: '' }, // empty header for delete icon
];

const MyAdsTable = () => {
    const { general_store, my_ads_store } = useStores();

    React.useEffect(() => {
        my_ads_store.setAdverts([]);
        my_ads_store.loadMoreAds({ startIndex: 0 }, true);
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
                    {isDesktop() && (
                        <Button
                            large
                            primary
                            is_disabled={general_store.is_barred}
                            onClick={my_ads_store.onClickCreate}
                        >
                            {localize('Create new ad')}
                        </Button>
                    )}
                    <ToggleAds />
                </div>
                <Table
                    className={classNames('p2p-my-ads__table', {
                        'p2p-my-ads__table--disabled': !general_store.is_listed || general_store.is_barred,
                    })}
                >
                    {isDesktop() && (
                        <Table.Header>
                            <Table.Row className='p2p-my-ads__table-row'>
                                {getHeaders(general_store.client.currency).map(header => (
                                    <Table.Head key={header.text}>{header.text}</Table.Head>
                                ))}
                            </Table.Row>
                        </Table.Header>
                    )}
                    <Table.Body className='p2p-my-ads__table-body'>
                        <InfiniteDataList
                            data_list_className='p2p-my-ads__data-list'
                            items={my_ads_store.adverts}
                            rowRenderer={row_props => <MyAdsRowRenderer {...row_props} />}
                            has_more_items_to_load={my_ads_store.has_more_items_to_load}
                            loadMoreRowsFn={my_ads_store.loadMoreAds}
                            keyMapperFn={item => item.id}
                            getRowSize={() => (isMobile() ? 123 : 56)}
                        />
                    </Table.Body>
                </Table>

                {isMobile() && (
                    <div className='p2p-my-ads__create-container'>
                        <Button className='p2p-my-ads__create' large primary onClick={my_ads_store.onClickCreate}>
                            {localize('Create new ad')}
                        </Button>
                    </div>
                )}
                <MyAdsDeleteModal />
            </React.Fragment>
        );
    }

    return (
        <Empty icon='IcCashierNoAds' title={localize('You have no ads.')}>
            <Button
                className='p2p-empty__button'
                is_disabled={general_store.is_barred}
                onClick={() => my_ads_store.onClickCreate()}
                large
                primary
            >
                {localize('Create new ad')}
            </Button>
        </Empty>
    );
};

export default observer(MyAdsTable);
