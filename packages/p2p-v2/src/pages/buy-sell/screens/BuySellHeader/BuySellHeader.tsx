import React from 'react';
import { Search } from '@/components';
import { SORT_BY_LIST } from '@/constants';
import { TSortByValues } from '@/utils';
import { Tab, Tabs, useDevice } from '@deriv-com/ui';
import { CurrencyDropdown, SortDropdown } from '../../components';
import './BuySellHeader.scss';

type TBuySellHeaderProps = {
    activeTab: string;
    selectedCurrency: string;
    setActiveTab: (tab: string) => void;
    setIsFilterModalOpen: (value: boolean) => void;
    setSearchValue: (value: string) => void;
    setSelectedCurrency: (value: string) => void;
    setSortDropdownValue: (value: TSortByValues) => void;
    sortDropdownValue: TSortByValues;
};

const BuySellHeader = ({
    activeTab,
    selectedCurrency,
    setActiveTab,
    setIsFilterModalOpen,
    setSearchValue,
    setSelectedCurrency,
    setSortDropdownValue,
    sortDropdownValue,
}: TBuySellHeaderProps) => {
    const { isMobile } = useDevice();

    return (
        <div className='p2p-v2-buy-sell-header' data-testid='dt_p2p_v2_buy_sell_header'>
            <Tabs
                TitleFontSize='sm'
                activeTab={activeTab}
                onChange={(index: number) => setActiveTab(index === 0 ? 'Buy' : 'Sell')}
                variant='primary'
                wrapperClassName='p2p-v2-buy-sell-header__tabs'
            >
                <Tab title='Buy' />
                <Tab title='Sell' />
            </Tabs>
            <div className='p2p-v2-buy-sell-header__row'>
                <div className='flex flex-row-reverse lg:flex-row gap-4'>
                    <CurrencyDropdown selectedCurrency={selectedCurrency} setSelectedCurrency={setSelectedCurrency} />
                    <div className='p2p-v2-buy-sell-header__row-search'>
                        <Search
                            name='search-nickname'
                            onSearch={setSearchValue}
                            placeholder={isMobile ? 'Search' : 'Search by nickname'}
                        />
                    </div>
                </div>
                <SortDropdown
                    list={SORT_BY_LIST}
                    onSelect={setSortDropdownValue}
                    setIsFilterModalOpen={setIsFilterModalOpen}
                    value={sortDropdownValue}
                />
            </div>
        </div>
    );
};

export default BuySellHeader;
