import React from 'react';
import debounce from 'lodash.debounce';
import { Icon } from '@deriv/components';
import { observer } from '@deriv/stores';
import { useDBotStore } from 'Stores/useDBotStore';

type TSearchIcon = {
    search: string;
    is_search_loading: boolean;
    onClick: () => void;
};

const SearchIcon = observer(({ search, is_search_loading, onClick }: TSearchIcon) => {
    const { rudder_stack } = useDBotStore();
    const { trackActionsWithUserInfo } = rudder_stack;

    React.useEffect(() => {
        const payload = {
            search_string: search,
        };
        debounce(() => {
            if (search && !is_search_loading) trackActionsWithUserInfo('ce_bot_builder_form', payload);
        }, 2000)();
    }, [is_search_loading]);

    if (!search) return <Icon icon='IcSearch' />;
    if (is_search_loading) return <div className='loader' data-testid='loader' />;
    return <Icon icon='IcCloseCircle' onClick={onClick} color='secondary' />;
});

export default SearchIcon;
