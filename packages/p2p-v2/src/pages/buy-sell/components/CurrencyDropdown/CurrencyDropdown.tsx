import React, { useMemo, useState } from 'react';
import clsx from 'clsx';
import { FullPageMobileWrapper, Search } from '@/components';
import { p2p } from '@deriv/api';
import { LabelPairedChevronDownMdRegularIcon } from '@deriv/quill-icons';
import { Dropdown, Text, useDevice } from '@deriv-com/ui';
import './CurrencyDropdown.scss';

type TCurrencyDropdownProps = {
    selectedCurrency: string;
    setSelectedCurrency: (value: string) => void;
};

const CurrencyDropdown = ({ selectedCurrency, setSelectedCurrency }: TCurrencyDropdownProps) => {
    const { data } = p2p.settings.useGetSettings();
    const { isMobile } = useDevice();
    const [showFullPageModal, setShowFullPageModal] = useState<boolean>(false);
    const [searchedCurrency, setSearchedCurrency] = useState<string>('');

    const localCurrencies = useMemo(() => {
        return data?.currency_list
            ? data.currency_list
                  .sort((a, b) => a.value.localeCompare(b.value))
                  .sort((a, b) => {
                      if (a.value === selectedCurrency) return -1;
                      if (b.value === selectedCurrency) return 1;
                      return 0;
                  })
            : [];
    }, [data?.currency_list, selectedCurrency]);

    const [searchedCurrencies, setSearchedCurrencies] = useState(localCurrencies);

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

    if (showFullPageModal && isMobile)
        return (
            <FullPageMobileWrapper
                className='p2p-v2-currency-dropdown__full-page-modal'
                onBack={() => {
                    setShowFullPageModal(false);
                    setSearchedCurrencies(localCurrencies);
                }}
                renderHeader={() => (
                    <Text size='lg' weight='bold'>
                        Preferred currency
                    </Text>
                )}
            >
                <Search
                    delayTimer={0}
                    name='search-currency'
                    onSearch={(value: string) => searchCurrencies(value)}
                    placeholder='Search'
                />
                <div className='mt-[5.6rem]'>
                    {searchedCurrencies.length > 0 ? (
                        searchedCurrencies.map(currency => {
                            const isSelectedCurrency = currency.value === selectedCurrency;

                            return (
                                <div
                                    className='mx-[1.6rem] my-[0.8rem] cursor-pointer'
                                    key={currency.value}
                                    onClick={() => {
                                        setSelectedCurrency(currency.value);
                                        setShowFullPageModal(false);
                                        setSearchedCurrencies(localCurrencies);
                                    }}
                                >
                                    <div
                                        className={clsx('flex justify-between rounded px-[1.6rem] py-[0.8rem]', {
                                            'bg-[#d6dadb]': isSelectedCurrency,
                                        })}
                                    >
                                        <Text weight={isSelectedCurrency ? 'bold' : '400'}>{currency.text}</Text>
                                        <Text>{currency.display_name}</Text>
                                    </div>
                                </div>
                            );
                        })
                    ) : (
                        <Text align='center' className='mt-64 flex justify-center' size='md' weight='bold'>
                            No results for &quot;{searchedCurrency}&quot;.
                        </Text>
                    )}
                </div>
            </FullPageMobileWrapper>
        );

    return (
        <div className='p2p-v2-currency-dropdown' onClick={() => isMobile && setShowFullPageModal(true)}>
            <Dropdown
                dropdownIcon={<LabelPairedChevronDownMdRegularIcon />}
                label='Currency'
                list={localCurrencies || []}
                name='Currency'
                onSelect={(value: string) => setSelectedCurrency(value)}
                value={selectedCurrency}
            />
        </div>
    );
};

export default CurrencyDropdown;
