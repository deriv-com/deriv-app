import React, { useState } from 'react';
import clsx from 'clsx';
import { Search } from '@/components/Search';
import { Checkbox, Divider } from '@deriv-com/ui';
import { NoSearchResults } from '../NoSearchResults';
import './PreferredCountriesDropdown.scss';

type TItem = { text: string; value: string };
type TPreferredCountriesDropdownProps = {
    list: TItem[];
    selectedCountries: string[];
    setSelectedCountries: (value: string[]) => void;
    setShouldDisplayFooter: (value: boolean) => void;
};

const PreferredCountriesDropdown = ({
    list = [],
    selectedCountries,
    setSelectedCountries,
    setShouldDisplayFooter,
}: TPreferredCountriesDropdownProps) => {
    const [searchResults, setSearchResults] = useState<TItem[]>(list);
    const [searchValue, setSearchValue] = useState('');

    const onSearch = (value: string) => {
        if (!value) {
            setShouldDisplayFooter(true);
            setSearchValue('');
            setSearchResults(list);
            return;
        }
        setShouldDisplayFooter(false);
        setSearchValue(value);
        setSearchResults(list.filter(item => item.text.toLowerCase().includes(value.toLowerCase())));
    };
    return (
        <div className='p2p-v2-preferred-countries-dropdown'>
            <div className='px-[1.6rem] py-4'>
                <Search
                    hideBorder
                    name='preferred-countries-search'
                    onSearch={onSearch}
                    placeholder='Search countries'
                />
            </div>
            <Divider className='w-full' color='#f2f3f4' />
            <div>
                {searchResults?.length > 0 ? (
                    <div
                        className={clsx('p2p-v2-preferred-countries-dropdown__content', {
                            'p2p-v2-preferred-countries-dropdown__content--no-footer': searchValue?.length > 0,
                        })}
                    >
                        {searchResults?.length === list?.length && (
                            <div className='p-[1.6rem]'>
                                <Checkbox
                                    checked={selectedCountries?.length === list?.length}
                                    label='All countries'
                                    name='all-countries'
                                    onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                                        if (event.target.checked) {
                                            setSelectedCountries(list.map(item => item.value));
                                        } else {
                                            setSelectedCountries([]);
                                        }
                                    }}
                                />
                            </div>
                        )}
                        <Divider className='w-full' color='#f2f3f4' />

                        {searchResults?.map((item: TItem) => (
                            <div className='p-[1.6rem]' key={item.value}>
                                <Checkbox
                                    checked={selectedCountries?.includes(item.value)}
                                    label={item.text}
                                    name={item.value}
                                    onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                                        if (event.target.checked) {
                                            setSelectedCountries([...selectedCountries, item.value]);
                                        } else {
                                            setSelectedCountries(
                                                selectedCountries.filter(value => value !== item.value)
                                            );
                                        }
                                    }}
                                />
                            </div>
                        ))}
                    </div>
                ) : (
                    <NoSearchResults value={searchValue} />
                )}
            </div>
        </div>
    );
};

export default PreferredCountriesDropdown;
