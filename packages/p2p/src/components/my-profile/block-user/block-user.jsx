import React from 'react';
import { observer } from 'mobx-react-lite';
import { useStores } from 'Stores';
import { DesktopWrapper, MobileFullPageModal, MobileWrapper } from '@deriv/components';
import BlockUserModal from 'Components/block-user/block-user-modal';
import BlockUserTable from 'Components/my-profile/block-user/block-user-table/block-user-table';
import SearchBox from 'Components/search-box';
import { my_profile_tabs } from 'Constants/my-profile-tabs';
import debounce from 'lodash.debounce';
import { localize } from 'Components/i18next';

const BlockUserList = observer(() => {
    const { general_store, my_profile_store } = useStores();

    const loadBlockedAdvertisers = debounce(search => {
        my_profile_store.setSearchTerm(search.trim());
        my_profile_store.loadMoreBlockedAdvertisers();
    }, 200);

    const onSearch = search => {
        // Ensures that blocked advertisers list is not reloaded if search term entered is the same
        if (my_profile_store.search_term !== search.trim()) {
            my_profile_store.setIsLoading(true);
            loadBlockedAdvertisers(search);
        }
    };

    const onClear = () => {
        my_profile_store.setSearchTerm('');
        my_profile_store.setSearchResults([]);
    };

    return (
        <div className='block-user__list'>
            {my_profile_store.blocked_advertisers_list.length > 0 && !general_store.is_barred && (
                <SearchBox onClear={onClear} onSearch={onSearch} placeholder={localize('Search')} />
            )}
            <BlockUserTable />
        </div>
    );
});

const BlockUser = () => {
    const { general_store, my_profile_store } = useStores();

    return (
        <React.Fragment>
            <BlockUserModal
                advertiser_name={my_profile_store.selected_blocked_user.name}
                is_advertiser_blocked
                is_block_user_modal_open={general_store.is_block_user_modal_open}
                onCancel={() => general_store.setIsBlockUserModalOpen(false)}
                onSubmit={my_profile_store.onSubmit}
            />
            <DesktopWrapper>
                <BlockUserList />
            </DesktopWrapper>
            <MobileWrapper>
                <MobileFullPageModal
                    body_className='block-user__modal'
                    height_offset='80px'
                    is_flex
                    is_modal_open
                    page_header_className='buy-sell__modal-header'
                    page_header_text={localize('Blocked advertisers')}
                    pageHeaderReturnFn={() => my_profile_store.setActiveTab(my_profile_tabs.MY_STATS)}
                >
                    <BlockUserList />
                </MobileFullPageModal>
            </MobileWrapper>
        </React.Fragment>
    );
};

export default observer(BlockUser);
