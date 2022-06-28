import React from 'react';
import { InfiniteDataList, Loading, Table } from '@deriv/components';
import { useStores } from 'Stores';
import { observer } from 'mobx-react-lite';
import BlockUserRow from './block-user-row.jsx';
import { TableError } from 'Components/table/table-error.jsx';
import { isMobile } from '@deriv/shared';
import BlockUserEmpty from 'Components/advertiser-page/block-user/block-user-empty';
import './block-user.scss';

const BlockUserTable = () => {
    const { advertiser_page_store, my_profile_store } = useStores();

    React.useEffect(() => {
        advertiser_page_store.setIsLoading(false);
        my_profile_store.setBlockedAdvertisersList([]);
        my_profile_store.getBlockedAdvertisersList();

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    if (my_profile_store.is_loading || advertiser_page_store.is_loading) {
        return <Loading is_fullscreen={isMobile()} />;
    }

    if (my_profile_store.error_message) {
        return <TableError message={my_profile_store.error_message} />;
    }

    if (my_profile_store.blocked_advertisers_list.length) {
        return (
            <React.Fragment>
                <Table className='block-user__table'>
                    <Table.Body className='block-user__table-body'>
                        <InfiniteDataList
                            data_list_className='block-user__data-list'
                            has_more_items_to_load={false}
                            items={my_profile_store.blocked_advertisers_list}
                            keyMapperFn={item => item.id}
                            loadMoreRowsFn={() => {}}
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
