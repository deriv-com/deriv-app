import React from 'react';
import { Icon } from '@deriv/components';
import debounce from 'lodash.debounce';
import { Analytics } from '@deriv/analytics';
import { observer } from '@deriv/stores';

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
                Analytics.trackEvent('ce_bot_builder_form', {
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
