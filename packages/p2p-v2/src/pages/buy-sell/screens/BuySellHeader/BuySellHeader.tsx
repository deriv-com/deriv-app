import React, { useState } from 'react';
import { Search } from '@/components';
import { FilterModal } from '@/components/Modals';
import { SORT_BY_LIST } from '@/constants';
import { TSortByValues } from '@/utils';
import { LabelPairedBarsFilterMdBoldIcon, LabelPairedBarsFilterSmBoldIcon } from '@deriv/quill-icons';
import { Button, Tab, Tabs, useDevice } from '@deriv-com/ui';
import { CurrencyDropdown, SortDropdown } from '../../components';
import './BuySellHeader.scss';

type TBuySellHeaderProps = {
    activeTab: string;
    selectedCurrency: string;
    selectedPaymentMethods: string[];
    setActiveTab: (tab: string) => void;
    setIsFilterModalOpen: (value: boolean) => void;
    setSearchValue: (value: string) => void;
    setSelectedCurrency: (value: string) => void;
    setSelectedPaymentMethods: (value: string[]) => void;
    setShouldUseClientLimits: (value: boolean) => void;
    setSortDropdownValue: (value: TSortByValues) => void;
    shouldUseClientLimits: boolean;
    sortDropdownValue: TSortByValues;
};

const BuySellHeader = ({
    activeTab,
    selectedCurrency,
    selectedPaymentMethods,
    setActiveTab,
    setIsFilterModalOpen,
    setSearchValue,
    setSelectedCurrency,
    setSelectedPaymentMethods,
    setShouldUseClientLimits,
    setSortDropdownValue,
    shouldUseClientLimits,
    sortDropdownValue,
}: TBuySellHeaderProps) => {
    const { isMobile } = useDevice();
    const [isModalOpen, setIsModalOpen] = useState(false);

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
                <Button
                    className='!border-[#d6dadb] border-[1px] lg:p-0 lg:h-16 lg:w-16 h-[3.2rem] w-[3.2rem]'
                    color='black'
                    icon={
                        isMobile ? (
                            <LabelPairedBarsFilterSmBoldIcon
                                className='absolute'
                                data-testid='dt_p2p_v2_buy_sell_header_filter_button'
                            />
                        ) : (
                            <LabelPairedBarsFilterMdBoldIcon />
                        )
                    }
                    onClick={() => setIsModalOpen(true)}
                    variant='outlined'
                />
            </div>
            <FilterModal
                isModalOpen={isModalOpen}
                isToggled={shouldUseClientLimits}
                onRequestClose={() => setIsModalOpen(false)}
                onToggle={setShouldUseClientLimits}
                selectedPaymentMethods={selectedPaymentMethods}
                setSelectedPaymentMethods={setSelectedPaymentMethods}
            />
        </div>
    );
};

export default BuySellHeader;
