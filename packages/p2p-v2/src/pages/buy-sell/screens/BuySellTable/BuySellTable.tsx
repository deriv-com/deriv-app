import React, { useEffect, useState } from 'react';
import { RadioGroupFilterModal } from '@/components/Modals';
import { BUY_SELL, SORT_BY_LIST } from '@/constants';
import { TSortByValues } from '@/utils';
import { p2p } from '@deriv/api-v2';
import { BuySellHeader } from '../BuySellHeader';
import { BuySellTableRenderer } from './BuySellTableRenderer';
import './BuySellTable.scss';

const BuySellTable = () => {
    const { data: p2pSettingsData } = p2p.settings.useGetSettings();

    const [activeTab, setActiveTab] = useState<string>('Buy');
    const [selectedCurrency, setSelectedCurrency] = useState<string>(p2pSettingsData?.localCurrency || '');
    const [sortDropdownValue, setSortDropdownValue] = useState<TSortByValues>('rate');
    const [searchValue, setSearchValue] = useState<string>('');
    const [isFilterModalOpen, setIsFilterModalOpen] = useState<boolean>(false);
    const [selectedPaymentMethods, setSelectedPaymentMethods] = useState<string[]>([]);
    const [shouldUseClientLimits, setShouldUseClientLimits] = useState<boolean>(true);

    const { data, isFetching, isLoading, loadMoreAdverts } = p2p.advert.useGetList({
        advertiser_name: searchValue,
        counterparty_type: activeTab === 'Buy' ? BUY_SELL.BUY : BUY_SELL.SELL,
        local_currency: selectedCurrency,
        payment_method: selectedPaymentMethods.length > 0 ? selectedPaymentMethods : undefined,
        sort_by: sortDropdownValue,
        use_client_limits: shouldUseClientLimits ? 1 : 0,
    });

    const onToggle = (value: string) => {
        setSortDropdownValue(value as TSortByValues);
        setIsFilterModalOpen(false);
    };

    useEffect(() => {
        if (p2pSettingsData?.localCurrency) setSelectedCurrency(p2pSettingsData.localCurrency);
    }, [p2pSettingsData?.localCurrency]);

    return (
        <div className='p2p-v2-buy-sell-table h-full w-full relative flex flex-col'>
            <BuySellHeader
                activeTab={activeTab}
                selectedCurrency={selectedCurrency}
                selectedPaymentMethods={selectedPaymentMethods}
                setActiveTab={setActiveTab}
                setIsFilterModalOpen={setIsFilterModalOpen}
                setSearchValue={setSearchValue}
                setSelectedCurrency={setSelectedCurrency}
                setSelectedPaymentMethods={setSelectedPaymentMethods}
                setShouldUseClientLimits={setShouldUseClientLimits}
                setSortDropdownValue={setSortDropdownValue}
                shouldUseClientLimits={shouldUseClientLimits}
                sortDropdownValue={sortDropdownValue}
            />
            <BuySellTableRenderer
                data={data}
                isFetching={isFetching}
                isLoading={isLoading}
                loadMoreAdverts={loadMoreAdverts}
                searchValue={searchValue}
            />
            <RadioGroupFilterModal
                isModalOpen={isFilterModalOpen}
                list={SORT_BY_LIST}
                onRequestClose={() => setIsFilterModalOpen(false)}
                onToggle={onToggle}
                selected={sortDropdownValue as string}
            />
        </div>
    );
};

export default BuySellTable;
