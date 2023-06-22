import React from 'react';
import { reaction } from 'mobx';
import { InfiniteDataList, Loading, Table, Text } from '@deriv/components';
import { isMobile } from '@deriv/shared';
import { observer } from '@deriv/stores';
import { Localize } from 'Components/i18next';
import { useStores } from 'Stores';
import BlockUserRow from './block-user-row';
import BlockUserEmpty from 'Components/block-user/block-user-empty';

const BlockUserTable = () => {
    const { general_store, my_profile_store } = useStores();

    React.useEffect(() => {
        my_profile_store.setTradePartnersList([]);
        my_profile_store.getTradePartnersList({ startIndex: 0 }, true);
        my_profile_store.setSearchTerm('');

        const disposeIsBarredReaction = reaction(
            () => general_store.is_barred,
            () => {
                if (!general_store.is_barred) general_store.setBlockUnblockUserError('');
                my_profile_store.setSearchTerm('');
                my_profile_store.getTradePartnersList({ startIndex: 0 }, true);
            }
        );

        const disposeTradePartnersListReaction = reaction(
            () => my_profile_store.trade_partners_list,
            () => {
                if (my_profile_store.trade_partners_list.length > 0 && my_profile_store.is_trade_partners_list_empty)
                    my_profile_store.setIsTradePartnersListEmpty(false);
            }
        );

        return () => {
            disposeIsBarredReaction();
            disposeTradePartnersListReaction();
            my_profile_store.setTradePartnersList([]);
            my_profile_store.setSearchTerm('');
            my_profile_store.setSearchResults([]);
        };

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    if (my_profile_store.is_block_user_table_loading) {
        return <Loading is_fullscreen={isMobile()} />;
    }

    if (my_profile_store.search_term && my_profile_store.rendered_trade_partners_list.length === 0) {
        return (
            <Text align='center' className='block-user-table__text' weight={isMobile() ? 'normal' : 'bold'}>
                <Localize i18n_default_text='There are no matching name.' />
            </Text>
        );
    }

    if (my_profile_store.rendered_trade_partners_list.length) {
        return (
            <React.Fragment>
                <Table className='block-user-table'>
                    <Table.Body className='block-user-table__body'>
                        <InfiniteDataList
                            data_list_className='block-use-table__data-list'
                            has_filler
                            has_more_items_to_load={my_profile_store.has_more_items_to_load}
                            items={my_profile_store.rendered_trade_partners_list}
                            keyMapperFn={item => item.id}
                            loadMoreRowsFn={my_profile_store.getTradePartnersList}
                            rowRenderer={props => <BlockUserRow {...props} />}
                        />
                    </Table.Body>
                </Table>
            </React.Fragment>
        );
    }

    return <BlockUserEmpty />;
};

export default observer(BlockUserTable);
