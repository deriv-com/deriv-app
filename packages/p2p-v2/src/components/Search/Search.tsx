import React, { useCallback } from 'react';
import clsx from 'clsx';
import { LabelPairedSearchMdRegularIcon } from '@deriv/quill-icons';
import { Input } from '@deriv-com/ui';
import './Search.scss';

type TSearchProps = {
    delayTimer?: number;
    hideBorder?: boolean;
    name: string;
    onSearch: (value: string) => void;
    placeholder: string;
};

//TODO: replace the component with deriv shared component
const Search = ({ delayTimer = 500, hideBorder = false, name, onSearch, placeholder }: TSearchProps) => {
    const debounce = (func: (value: string) => void, delay: number) => {
        let timer: ReturnType<typeof setTimeout>;
        return (value: string) => {
            clearTimeout(timer);
            timer = setTimeout(() => func(value), delay);
        };
    };

    const debouncedOnSearch = useCallback(debounce(onSearch, delayTimer), [onSearch]);

    return (
        <form
            className='p2p-v2-search'
            onChange={event => debouncedOnSearch((event.target as HTMLInputElement).value)}
            role='search'
        >
            <Input
                className={clsx({ 'border-none': hideBorder })}
                label={placeholder}
                leftPlaceholder={<LabelPairedSearchMdRegularIcon />}
                name={name}
                type='search'
            />
        </form>
    );
};

export default Search;
