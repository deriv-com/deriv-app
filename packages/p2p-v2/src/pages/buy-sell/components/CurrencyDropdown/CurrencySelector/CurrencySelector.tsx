import React, { useState } from 'react';
import clsx from 'clsx';
import { TCurrencyListItem } from 'types';
import { Search } from '@/components';
import { Text, useDevice } from '@deriv-com/ui';
import './CurrencySelector.scss';

type TCurrencySelectorProps = {
    localCurrencies: TCurrencyListItem[];
    onSelectItem: (value: string) => void;
    selectedCurrency: string;
};

const CurrencySelector = ({ localCurrencies, onSelectItem, selectedCurrency }: TCurrencySelectorProps) => {
    const [searchedCurrency, setSearchedCurrency] = useState<string>('');
    const [searchedCurrencies, setSearchedCurrencies] = useState(localCurrencies);
    const { isMobile } = useDevice();

    const textSize = isMobile ? 'md' : 'sm';

    const searchCurrencies = (value: string) => {
        if (!value) {
            setSearchedCurrencies(localCurrencies);
            return;
        }

        setSearchedCurrency(value);

        setSearchedCurrencies(
            localCurrencies.filter(currency => {
                return (
                    currency.value.toLowerCase().includes(value.toLocaleLowerCase()) ||
                    currency.display_name.toLowerCase().includes(value.toLocaleLowerCase())
                );
            })
        );
    };

    return (
        <div className='p2p-v2-currency-selector'>
            <Search
                delayTimer={0}
                name='search-currency'
                onSearch={(value: string) => searchCurrencies(value)}
                placeholder='Search'
            />
            <div className='p2p-v2-currency-selector__list'>
                {searchedCurrencies.length > 0 ? (
                    searchedCurrencies.map(currency => {
                        const isSelectedCurrency = currency.value === selectedCurrency;

                        return (
                            <div
                                className='lg:m-0 mx-[1.6rem] my-[0.8rem] cursor-pointer'
                                key={currency.value}
                                onClick={() => onSelectItem(currency.value)}
                            >
                                <div
                                    className={clsx(
                                        'flex justify-between rounded px-[1.6rem] py-[0.8rem] lg:hover:bg-[#d6dadb]',
                                        {
                                            'bg-[#d6dadb]': isSelectedCurrency,
                                        }
                                    )}
                                >
                                    <Text size={textSize} weight={isSelectedCurrency ? 'bold' : 'normal'}>
                                        {currency.text}
                                    </Text>
                                    <Text align='right' size={textSize}>
                                        {currency.display_name}
                                    </Text>
                                </div>
                            </div>
                        );
                    })
                ) : (
                    <Text
                        align={isMobile ? 'center' : 'left'}
                        className='lg:mt-0 lg:p-4 mt-64 flex lg:justify-start justify-center'
                        size={textSize}
                        weight={isMobile ? 'bold' : 'normal'}
                    >
                        No results for &quot;{searchedCurrency}&quot;.
                    </Text>
                )}
            </div>
        </div>
    );
};

export default CurrencySelector;
