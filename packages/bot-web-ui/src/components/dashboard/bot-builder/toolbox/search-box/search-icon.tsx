import React from 'react';
import debounce from 'lodash.debounce';
import { RudderStack } from '@deriv/analytics';
import { Icon } from '@deriv/components';
import { observer } from '@deriv/stores';
import { useDBotStore } from 'Stores/useDBotStore';

type TSearchIcon = {
    search: string;
    is_search_loading: boolean;
    onClick: () => void;
};

const SearchIcon = observer(({ search, is_search_loading, onClick }: TSearchIcon) => {
    React.useEffect(() => {
        //this is to check after keup on bot-builder page form sent even to rudderstack
        debounce(() => {
            if (search && !is_search_loading) {
                RudderStack.track('ce_bot_builder_form', {
                    search_string: search,
                    action: 'search',
                });
            }
        }, 2000)();
    }, [is_search_loading]);

    if (!search) return <Icon icon='IcSearch' />;
    if (is_search_loading) return <div className='loader' data-testid='loader' />;
    return <Icon icon='IcCloseCircle' onClick={onClick} color='secondary' />;
});

export default SearchIcon;
