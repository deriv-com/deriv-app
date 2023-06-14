import React from 'react';
import { reaction } from 'mobx';
import { DesktopWrapper, InfiniteDataList, Loading, Table, Text } from '@deriv/components';
import { observer, useStore } from '@deriv/stores';
import { Localize } from 'Components/i18next';
import { TableError } from 'Components/table/table-error.jsx';
import BuySellTableRow from 'Components/buy-sell/buy-sell-table/buy-sell-table-row';
import BuySellTableNoAds from 'Components/buy-sell/buy-sell-table/buy-sell-table-no-ads';
import { useStores } from 'Stores';

type TBuySellTableProps = {
    onScroll: () => void;
};

const BuySellTable = ({ onScroll }: TBuySellTableProps) => {
    const { buy_sell_store, my_profile_store } = useStores();
    const {
        api_error_message,
        fetchAdvertiserAdverts,
        has_more_items_to_load,
        is_buy,
        is_loading,
        items,
        loadMoreItems,
        rendered_items,
        setSelectedAdvert,
        showAdvertiserPage,
    } = buy_sell_store;
    const { getPaymentMethodsList } = my_profile_store;
    const {
        client: { currency },
    } = useStore();

    React.useEffect(
        () => {
            getPaymentMethodsList();
            const disposeBuyAdvertsReaction = reaction(
                () => is_buy,
                () => fetchAdvertiserAdverts(),
                { fireImmediately: true }
            );

            return () => {
                disposeBuyAdvertsReaction();
            };
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        []
    );

    if (is_loading) {
        return <Loading is_fullscreen={false} />;
    }

    if (api_error_message) {
        return <TableError message={api_error_message} />;
    }

    if (items.length) {
        return (
            <Table className='buy-sell-table'>
                <DesktopWrapper>
                    <Table.Header>
                        <Table.Row className='buy-sell-table__header'>
                            <Table.Head>
                                <Localize i18n_default_text='Advertisers' />
                            </Table.Head>
                            <Table.Head>
                                <Localize i18n_default_text='Limits' />
                            </Table.Head>
                            <Table.Head>
                                <Localize i18n_default_text='Rate (1 {{currency}})' values={{ currency }} />
                            </Table.Head>
                            <Table.Head>
                                <Localize i18n_default_text='Payment methods' />
                            </Table.Head>
                            <Table.Head />
                        </Table.Row>
                    </Table.Header>
                </DesktopWrapper>
                <Table.Body className='buy-sell-table__body'>
                    <InfiniteDataList
                        data_list_className='buy-sell-table__data-list'
                        items={rendered_items}
                        rowRenderer={props => (
                            <BuySellTableRow
                                {...props}
                                is_buy={is_buy}
                                setSelectedAdvert={setSelectedAdvert}
                                showAdvertiserPage={showAdvertiserPage}
                            />
                        )}
                        loadMoreRowsFn={loadMoreItems}
                        has_filler
                        has_more_items_to_load={has_more_items_to_load}
                        keyMapperFn={item => item.id}
                        onScroll={onScroll}
                    />
                </Table.Body>
            </Table>
        );
    }

    return <BuySellTableNoAds />;
};

export default observer(BuySellTable);
