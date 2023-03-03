import React from 'react';
import { observer } from 'mobx-react-lite';
import { useStores } from 'Stores';
import { Loading, SearchBox, Text } from '@deriv/components';
import { isMobile } from '@deriv/shared';
import BlockUserDropdown from '../block-user-dropdown';
import BlockUserTable from '../block-user-table';
import BlockUserTableError from '../block-user-table/block-user-table-error';
import debounce from 'lodash.debounce';
import { localize } from 'Components/i18next';
import './block-user-list.scss';

const BlockUserList = observer(() => {
    const { general_store, my_profile_store } = useStores();

    const debouncedGetSearchedTradePartners = debounce(search => {
        my_profile_store.setSearchTerm(search.trim());
        my_profile_store.getSearchedTradePartners();
    }, 200);

    const onSearch = search => {
        // Ensures that trade partners list is not reloaded if search term entered is the same
        if (my_profile_store.search_term !== search.trim()) {
            my_profile_store.setIsBlockUserTableLoading(true);
            debouncedGetSearchedTradePartners(search);
        }
    };

    if (general_store.is_barred && general_store.block_unblock_user_error) {
        return <BlockUserTableError error_message={general_store.block_unblock_user_error} />;
    }

    if (my_profile_store.is_loading) {
        return <Loading is_fullscreen={isMobile()} />;
    }

    return (
        <div className='block-user-list'>
            {my_profile_store.trade_partners_list.length > 0 && (
                <React.Fragment>
                    <Text className='block-user-list__text' size='xs'>
                        {localize(
                            "When you block someone, you won't see their ads, and they can't see yours. Your ads will be hidden from their search results, too."
                        )}
                    </Text>
                    <div className='block-user-list__header'>
                        <SearchBox
                            onClear={my_profile_store.onClear}
                            onSearch={onSearch}
                            placeholder={localize('Search by nickname')}
                        />
                        <BlockUserDropdown />
                    </div>
                </React.Fragment>
            )}
            <BlockUserTable />
        </div>
    );
});

export default BlockUserList;
