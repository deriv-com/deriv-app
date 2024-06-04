import React, { useState } from 'react';
import { Input } from '@deriv-com/ui';
import CloseIcon from '../../assets/images/close-circle.svg';
import SearchIcon from '../../assets/images/search.svg';
import styles from './SearchBox.module.scss';

type TProps = {
    onSearchHandler: (value: string) => void;
    placeholder?: string;
};

const SearchBox: React.FC<TProps> = ({ onSearchHandler, placeholder }) => {
    const [searchTerm, setSearchTerm] = useState('');

    const onClear = () => {
        setSearchTerm('');
        onSearchHandler('');
    };

    const onChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.currentTarget.value;
        if (!value.trim()) {
            onClear();
            return;
        }
        setSearchTerm(value);
        onSearchHandler(value);
    };

    return (
        <Input
            autoComplete='off'
            label={placeholder}
            leftPlaceholder={<SearchIcon />}
            name='search'
            onChange={onChangeHandler}
            rightPlaceholder={
                searchTerm ? (
                    <CloseIcon className={styles['close-icon']} data-testid='dt_close_icon' onClick={onClear} />
                ) : null
            }
            type='text'
            value={searchTerm}
        />
    );
};

export default SearchBox;
