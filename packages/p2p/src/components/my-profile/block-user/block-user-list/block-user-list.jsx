import React from 'react';
import { observer } from 'mobx-react-lite';
import { useStores } from 'Stores';
import BlockUserDropdown from '../block-user-dropdown';
import BlockUserTable from '../block-user-table';
import BlockUserTableError from '../block-user-table/block-user-table-error';
import SearchBox from 'Components/search-box';
import debounce from 'lodash.debounce';
import { localize } from 'Components/i18next';
import './block-user-list.scss';

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

    if (general_store.is_barred && general_store.block_unblock_user_error) {
        return <BlockUserTableError error_message={general_store.block_unblock_user_error} />;
    }

    return (
        <div className='block-user-list'>
            {my_profile_store.blocked_advertisers_list.length > 0 && (
                <div className='block-user-list__header'>
                    <SearchBox onClear={onClear} onSearch={onSearch} placeholder={localize('Search by nickname')} />
                    <BlockUserDropdown />
                </div>
            )}
            <BlockUserTable />
        </div>
    );
});

export default BlockUserList;
