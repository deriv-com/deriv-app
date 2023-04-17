import React from 'react';
import PropTypes from 'prop-types';
import { InfiniteDataList, Loading, Modal, RadioGroup, Table, Text } from '@deriv/components';
import { isDesktop } from '@deriv/shared';
import { reaction } from 'mobx';
import { observer, useStore } from '@deriv/stores';
import { Localize } from 'Components/i18next';
import { TableError } from 'Components/table/table-error.jsx';
import { useStores } from 'Stores';
import BuySellRow from './buy-sell-row.jsx';
import NoAds from './no-ads/no-ads.jsx';

const BuySellRowRendererComponent = row_props => {
    const { buy_sell_store } = useStores();

    return (
        <BuySellRow
            {...row_props}
            is_buy={buy_sell_store.is_buy}
            setSelectedAdvert={buy_sell_store.setSelectedAdvert}
            showAdvertiserPage={buy_sell_store.showAdvertiserPage}
        />
    );
};

const BuySellRowRenderer = observer(BuySellRowRendererComponent);

const BuySellTable = ({ onScroll }) => {
    const { buy_sell_store, my_profile_store } = useStores();
    const {
        client: { currency },
    } = useStore();

    React.useEffect(
        () => {
            my_profile_store.getPaymentMethodsList();
            reaction(
                () => buy_sell_store.is_buy,
                () => buy_sell_store.fetchAdvertiserAdverts(),
                { fireImmediately: true }
            );
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        []
    );

    if (buy_sell_store.is_loading) {
        return <Loading is_fullscreen={false} />;
    }

    if (buy_sell_store.api_error_message) {
        return <TableError message={buy_sell_store.api_error_message} />;
    }

    if (buy_sell_store.items.length) {
        return (
            <>
                <Table className='buy-sell__table'>
                    <Modal
                        name='sort'
                        className='sort'
                        is_open={buy_sell_store.is_sort_dropdown_open}
                        height='10rem'
                        toggleModal={() => buy_sell_store.setIsSortDropdownOpen(false)}
                        width='80vw'
                    >
                        <RadioGroup
                            name='reason'
                            className='sort-radiogroup'
                            onToggle={buy_sell_store.handleChange}
                            selected={buy_sell_store.selected_value}
                            required
                        >
                            {buy_sell_store.sort_list.map((list_item, key) => {
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
                    {isDesktop() && (
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
                    )}
                    <Table.Body className='buy-sell__table-body'>
                        <InfiniteDataList
                            data_list_className='buy-sell__data-list'
                            items={buy_sell_store.rendered_items}
                            rowRenderer={props => <BuySellRowRenderer {...props} />}
                            loadMoreRowsFn={buy_sell_store.loadMoreItems}
                            has_filler
                            has_more_items_to_load={buy_sell_store.has_more_items_to_load}
                            keyMapperFn={item => item.id}
                            onScroll={onScroll}
                        />
                    </Table.Body>
                </Table>
            </>
        );
    }

    return <NoAds />;
};

BuySellTable.displayName = 'BuySellTable';
BuySellTable.propTypes = {
    onScroll: PropTypes.func,
};

export default observer(BuySellTable);
