import React from 'react';
import { Icon } from '@deriv/components';
import { observer } from '@deriv/stores';

type TSearchIcon = {
    search: string;
    is_search_loading: boolean;
    onClick: () => void;
};

const SearchIcon = observer(({ search, is_search_loading, onClick }: TSearchIcon) => {
    if (!search) return <Icon icon='IcSearch' />;
    if (is_search_loading) return <div className='loader' data-testid='loader' />;
    return <Icon icon='IcCloseCircle' onClick={onClick} color='secondary' />;
});

export default SearchIcon;
