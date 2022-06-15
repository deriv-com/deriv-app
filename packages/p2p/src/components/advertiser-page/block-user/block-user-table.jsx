import React from 'react';
import {
    DesktopWrapper,
    InfiniteDataList,
    Loading,
    MobileFullPageModal,
    MobileWrapper,
    Table,
} from '@deriv/components';
import { useStores } from 'Stores';
import { observer } from 'mobx-react-lite';
import BlockUserRow from './block-user-row.jsx';
import Empty from 'Components/empty/empty.jsx';
import { TableError } from 'Components/table/table-error.jsx';
import { localize } from 'Components/i18next';
import { my_profile_tabs } from 'Constants/my-profile-tabs';
import './block-user.scss';

const BlockUserTableRendererComponent = () => {
    const { my_profile_store } = useStores();

    return (
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
    );
};

const BlockUserTableRenderer = observer(BlockUserTableRendererComponent);

const BlockUserTable = () => {
    const { advertiser_page_store, my_profile_store } = useStores();

    React.useEffect(() => {
        advertiser_page_store.setIsLoading(false);
        my_profile_store.setBlockedAdvertisersList([]);
        my_profile_store.getBlockedAdvertisersList();

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    if (my_profile_store.is_loading || advertiser_page_store.is_loading) {
        return <Loading is_fullscreen={false} />;
    }

    if (my_profile_store.error_message) {
        return <TableError message={my_profile_store.error_message} />;
    }

    if (my_profile_store.blocked_advertisers_list.length) {
        return (
            <React.Fragment>
                <DesktopWrapper>
                    <BlockUserTableRenderer />
                </DesktopWrapper>
                <MobileWrapper>
                    <MobileFullPageModal
                        body_className='block-user__modal'
                        height_offset='80px'
                        is_flex
                        is_modal_open
                        page_header_className='buy-sell__modal-header'
                        page_header_text={localize('Blocked Advertisers')}
                        pageHeaderReturnFn={() => my_profile_store.setActiveTab(my_profile_tabs.MY_STATS)}
                    >
                        <BlockUserTableRenderer />
                    </MobileFullPageModal>
                </MobileWrapper>
            </React.Fragment>
        );
    }

    // TODO: Replace with Empty Advertiser's Tab once Blocked Advertisers Tab is merged
    return (
        <Empty
            className='buy-sell__empty'
            has_tabs
            icon='IcCashierNoAds'
            title={localize('You have no blocked advertisers')}
        />
    );
};

export default observer(BlockUserTable);
