import React from 'react';
import classNames from 'classnames';
import { InfiniteDataList, Loading, Table, Tabs } from '@deriv/components';
import { isMobile } from '@deriv/shared';
import { observer } from '@deriv/stores';
import Empty from 'Components/empty/empty.jsx';
import { localize } from 'Components/i18next';
import { useStores } from 'Stores/index';
import AdvertiserPageAdvertsTableHeader from './advertiser-page-adverts-table-header';
import AdvertiserPageRow, { TAdvertiserPageRow } from './advertiser-page-row';

const AdvertiserPageRowRenderer = (props: TAdvertiserPageRow) => <AdvertiserPageRow {...props} />;

const AdvertiserPageAdverts = () => {
    const { advertiser_page_store } = useStores();

    const {
        active_index,
        adverts,
        handleTabItemClick,
        has_more_adverts_to_load,
        is_loading_adverts,
        loadMoreAdvertiserAdverts,
    } = advertiser_page_store;

    return (
        <div className='advertiser-page__adverts'>
            <Tabs
                active_index={active_index}
                className='advertiser-page__adverts-tabs'
                header_fit_content
                is_full_width={isMobile()}
                onTabItemClick={handleTabItemClick}
                top
            >
                <div label={localize('Buy')} />
                <div label={localize('Sell')} />
            </Tabs>
            {is_loading_adverts ? (
                <div className='advertiser-page__adverts-table'>
                    <Loading is_fullscreen={false} />
                </div>
            ) : (
                <React.Fragment>
                    {adverts.length ? (
                        <Table className='advertiser-page__adverts-table'>
                            <AdvertiserPageAdvertsTableHeader />
                            <Table.Body className='advertiser-page__adverts-table-body'>
                                <InfiniteDataList
                                    data_list_className='advertiser-page__data-list'
                                    has_more_items_to_load={has_more_adverts_to_load}
                                    items={adverts}
                                    keyMapperFn={item => item.id}
                                    loadMoreRowsFn={loadMoreAdvertiserAdverts}
                                    rowRenderer={AdvertiserPageRowRenderer}
                                />
                            </Table.Body>
                        </Table>
                    ) : (
                        <Empty
                            className={classNames('', { 'advertiser-page-empty': isMobile() })}
                            icon='IcNoData'
                            title={localize('There are no ads yet')}
                        />
                    )}
                </React.Fragment>
            )}
        </div>
    );
};

export default observer(AdvertiserPageAdverts);
