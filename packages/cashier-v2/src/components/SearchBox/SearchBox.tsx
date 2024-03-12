import React, { useState } from 'react';
import { Input } from '@deriv-com/ui';
import CloseIcon from '../../assets/images/close-circle.svg';
import SearchIcon from '../../assets/images/search.svg';

type TProps = {
    onSearch: (value: string) => void;
};

const SearchBox: React.FC<TProps> = ({ onSearch }) => {
    const [searchTerm, setSearchTerm] = useState('');

    const onClear = () => {
        setSearchTerm('');
        onSearch?.('');
    };

    const onChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.currentTarget.value;
        if (!value.trim()) {
            onClear();
            return;
        }
        setSearchTerm(value);
        onSearch?.(value);
    };

    return (
        <Input
            autoComplete='off'
            label='Search payment agent name'
            leftPlaceholder={<SearchIcon />}
            name='search'
            onChange={onChangeHandler}
            rightPlaceholder={searchTerm ? <CloseIcon onClick={onClear} /> : null}
            type='text'
            value={searchTerm}
        />
    );
};

export default SearchBox;
