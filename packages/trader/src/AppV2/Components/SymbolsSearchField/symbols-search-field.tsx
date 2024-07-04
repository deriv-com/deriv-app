import React, { useState, useRef, useEffect } from 'react';
import { Button, SearchField } from '@deriv-com/quill-ui';
import clsx from 'clsx';
import { observer, useStore } from '@deriv/stores';
import { Localize, localize } from '@deriv/translations';

type TSymbolsSearchField = {
    isSearching: boolean;
    setIsSearching: (input: boolean) => void;
    searchValue: string;
    setSearchValue: (input: string) => void;
};
const SymbolsSearchField = observer(
    ({ isSearching, setIsSearching, searchValue, setSearchValue }: TSymbolsSearchField) => {
        const { ui } = useStore();
        const { is_dark_mode_on } = ui;
        const inputRef = useRef<HTMLInputElement | null>(null);

        useEffect(() => {
            const inputElement = inputRef.current;

            if (inputElement) {
                const handleFocus = () => setIsSearching(true);
                inputElement.addEventListener('focus', handleFocus);

                return () => {
                    inputElement.removeEventListener('focus', handleFocus);
                };
            }
            // eslint-disable-next-line react-hooks/exhaustive-deps
        }, []);

        const handleClear = () => {
            setSearchValue('');
            setIsSearching(false);
        };

        return (
            <div
                className={clsx('symbols-search-field--container', {
                    'symbols-search-field--isFocused': isSearching,
                })}
            >
                <SearchField
                    inputSize='sm'
                    placeholder={localize('Search markets on {{trade_type}}')}
                    variant='fill'
                    ref={inputRef}
                    value={searchValue}
                    onChange={e => {
                        setSearchValue(e.target.value);
                    }}
                />
                {isSearching && (
                    <Button
                        variant='tertiary'
                        label={<Localize i18n_default_text='Cancel' />}
                        size='sm'
                        color={is_dark_mode_on ? 'white' : 'black'}
                        onClick={handleClear}
                    />
                )}
            </div>
        );
    }
);

export default SymbolsSearchField;
