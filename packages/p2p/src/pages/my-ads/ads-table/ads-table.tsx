import React from 'react';
import classNames from 'classnames';
import { DesktopWrapper, InfiniteDataList, Table } from '@deriv/components';
import { useStore } from '@deriv/stores';
import { localize } from 'Components/i18next';
import { useStores } from 'Stores';
import { TAdDetails } from 'Types';
import MyAdsRow from './my-ads-row';

const getHeaders = (offered_currency: string) => [
    { text: localize('Ad ID') },
    { text: localize('Limits') },
    { text: localize('Rate (1 {{ offered_currency }})', { offered_currency }) },
    { text: localize('Available amount') },
    { text: localize('Payment methods') },
    { text: localize('Status') },
    { text: '' }, // empty header for delete and archive icons
];

const MyAdsRowRenderer = (props: TAdDetails) => <MyAdsRow {...props} />;

const AdsTable = () => {
    const {
        client: { currency },
    } = useStore();

    const { general_store, my_ads_store } = useStores();
    const { is_barred, is_listed } = general_store;
    const { adverts, has_more_items_to_load, loadMoreAds } = my_ads_store;

    return (
        <Table
            className={classNames('ads-table', {
                'ads-table--disabled': !is_listed || is_barred,
            })}
        >
            <DesktopWrapper>
                <Table.Header>
                    <Table.Row className='ads-table__row'>
                        {getHeaders(currency).map(({ text }) => (
                            <Table.Head key={text}>{text}</Table.Head>
                        ))}
                    </Table.Row>
                </Table.Header>
            </DesktopWrapper>
            <Table.Body className='ads-table__body'>
                <InfiniteDataList
                    data_list_className='my-ads__data-list'
                    has_more_items_to_load={has_more_items_to_load}
                    items={adverts}
                    keyMapperFn={item => item.id}
                    loadMoreRowsFn={loadMoreAds}
                    rowRenderer={MyAdsRowRenderer}
                />
            </Table.Body>
        </Table>
    );
};

export default AdsTable;
