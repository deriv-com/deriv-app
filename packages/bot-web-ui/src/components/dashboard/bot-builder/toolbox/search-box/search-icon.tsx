import React from 'react';
import { Icon } from '@deriv/components';

type TSearchIcon = {
    search: string;
    is_search_loading: boolean;
    onClick: () => void;
};

const SearchIcon = ({ search, is_search_loading, onClick }: TSearchIcon) => {
    if (!search) return <Icon icon='IcSearch' />;
    if (is_search_loading) return <div className='loader' />;
    return <Icon icon='IcCloseCircle' onClick={onClick} color='secondary' />;
};

export default SearchIcon;
