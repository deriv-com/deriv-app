import React from 'react';
import classNames from 'classnames';
import { InfiniteDataList, Loading, Table, Tabs } from '@deriv/components';
import { isDesktop, isMobile } from '@deriv/shared';
import { useStore, observer } from '@deriv/stores';
import { localize, Localize } from 'Components/i18next';
import { useStores } from 'Stores';
import Empty from 'Components/empty/empty.jsx';
import AdvertiserPageRow from './advertiser-page-row.jsx';
import './advertiser-page.scss';

const AdvertiserPageAdverts = () => {
    const {
        client: { currency },
    } = useStore();

    const { advertiser_page_store } = useStores();

    const AdvertiserPageRowRenderer = row_props => (
        <AdvertiserPageRow {...row_props} showAdPopup={advertiser_page_store.showAdPopup} />
    );

    return (
        <div className='advertiser-page__adverts'>
            <Tabs
                active_index={advertiser_page_store.active_index}
                className='advertiser-page__adverts-tabs'
                is_full_width={isMobile()}
                onTabItemClick={advertiser_page_store.handleTabItemClick}
                header_fit_content
                top
            >
                <div label={localize('Buy')} />
                <div label={localize('Sell')} />
            </Tabs>
            {advertiser_page_store.is_loading_adverts ? (
                <div className='advertiser-page__adverts-table'>
                    <Loading is_fullscreen={false} />
                </div>
            ) : (
                <React.Fragment>
                    {advertiser_page_store.adverts.length ? (
                        <Table className='advertiser-page__adverts-table'>
                            {isDesktop() && (
                                <Table.Header>
                                    <Table.Row className='advertiser-page__adverts-table_row'>
                                        <Table.Head>{localize('Limits')}</Table.Head>
                                        <Table.Head>
                                            {localize('Rate (1 {{currency}})', {
                                                currency,
                                            })}
                                        </Table.Head>
                                        <Table.Head>
                                            <Localize i18n_default_text='Payment methods' />
                                        </Table.Head>
                                        <Table.Head>{''}</Table.Head>
                                    </Table.Row>
                                </Table.Header>
                            )}
                            <Table.Body className='advertiser-page__adverts-table-body'>
                                <InfiniteDataList
                                    data_list_className='advertiser-page__data-list'
                                    items={advertiser_page_store.adverts}
                                    keyMapperFn={item => item.id}
                                    rowRenderer={AdvertiserPageRowRenderer}
                                    loadMoreRowsFn={advertiser_page_store.loadMoreAdvertiserAdverts}
                                    has_more_items_to_load={advertiser_page_store.has_more_adverts_to_load}
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
