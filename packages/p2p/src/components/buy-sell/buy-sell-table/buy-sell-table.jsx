import React from 'react';
import { reaction } from 'mobx';
import { DesktopWrapper, InfiniteDataList, Loading, Modal, RadioGroup, Table, Text } from '@deriv/components';
import { observer, useStore } from '@deriv/stores';
import { Localize } from 'Components/i18next';
import { TableError } from 'Components/table/table-error.jsx';
import BuySellTableRow from 'Components/buy-sell/buy-sell-table/buy-sell-table-row';
import BuySellTableNoAds from 'Components/buy-sell/buy-sell-table/buy-sell-table-no-ads';
import { useStores } from 'Stores';

const BuySellTable = ({ onScroll }) => {
    const { buy_sell_store, my_profile_store } = useStores();
    const {
        api_error_message,
        fetchAdvertiserAdverts,
        handleChange,
        has_more_items_to_load,
        is_buy,
        is_loading,
        is_sort_dropdown_open,
        items,
        loadMoreItems,
        rendered_items,
        selected_value,
        setIsSortDropdownOpen,
        setSelectedAdvert,
        showAdvertiserPage,
        sort_list,
    } = buy_sell_store;
    const { getPaymentMethodsList } = my_profile_store;
    const {
        client: { currency },
    } = useStore();

    React.useEffect(
        () => {
            getPaymentMethodsList();
            reaction(
                () => is_buy,
                () => fetchAdvertiserAdverts(),
                { fireImmediately: true }
            );
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
            <>
                <Table className='buy-sell__table'>
                    <Modal
                        name='sort'
                        className='sort'
                        is_open={is_sort_dropdown_open}
                        height='10rem'
                        toggleModal={() => setIsSortDropdownOpen(false)}
                        width='80vw'
                    >
                        <RadioGroup
                            name='reason'
                            className='sort-radiogroup'
                            onToggle={handleChange}
                            selected={selected_value}
                            required
                        >
                            {sort_list.map((list_item, key) => {
                                return (
                                    <RadioGroup.Item
                                        key={key}
                                        value={list_item.value}
                                        label={
                                            <Text color='prominent' size='s'>
                                                {list_item.text}
                                            </Text>
                                        }
                                    />
                                );
                            })}
                        </RadioGroup>
                    </Modal>
                    <DesktopWrapper>
                        <Table.Header>
                            <Table.Row className='buy-sell__table-header'>
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
                    <Table.Body className='buy-sell__table-body'>
                        <InfiniteDataList
                            data_list_className='buy-sell__data-list'
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
            </>
        );
    }

    return <BuySellTableNoAds />;
};

export default observer(BuySellTable);
