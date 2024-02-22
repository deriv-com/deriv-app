import React from 'react';
import { Search } from '@/components';
import { SORT_BY_LIST } from '@/constants';
import { TSortByValues } from '@/utils';
import { Tab, Tabs, useDevice } from '@deriv-com/ui';
import { SortDropdown } from '../../components';
import './BuySellHeader.scss';

type TBuySellHeaderProps = {
    activeTab: string;
    setActiveTab: (tab: string) => void;
    setIsFilterModalOpen: (value: boolean) => void;
    setSearchValue: (value: string) => void;
    setSortDropdownValue: (value: TSortByValues) => void;
    sortDropdownValue: TSortByValues;
};

const BuySellHeader = ({
    activeTab,
    setActiveTab,
    setIsFilterModalOpen,
    setSearchValue,
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
                <Search
                    name='search-nickname'
                    onSearch={setSearchValue}
                    placeholder={isMobile ? 'Search' : 'Search by nickname'}
                />
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
