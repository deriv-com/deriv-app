import React, { memo, useState } from 'react';
import { Table } from '@/components';
import { RadioGroupFilterModal } from '@/components/Modals';
import { BUY_SELL, SORT_BY_LIST } from '@/constants';
import { TSortByValues } from '@/utils';
import { p2p } from '@deriv/api';
import { Loader } from '@deriv-com/ui';
import { BuySellHeader } from '../BuySellHeader';
import { BuySellTableRow } from '../BuySellTableRow';
import './BuySellTable.scss';

export type TBuySellTableRowRenderer = Partial<NonNullable<ReturnType<typeof p2p.advert.useGetList>['data']>[0]>;

const BuySellRowRenderer = memo((values: TBuySellTableRowRenderer) => <BuySellTableRow {...values} />);
BuySellRowRenderer.displayName = 'BuySellRowRenderer';

const columns = [
    { header: 'Advertisers' },
    { header: 'Limits' },
    { header: 'Rate (1 USD)' },
    { header: 'Payment methods' },
];

const headerRenderer = (header: string) => <span>{header}</span>;

const BuySellTable = () => {
    const [activeTab, setActiveTab] = useState<string>('Buy');
    const [sortDropdownValue, setSortDropdownValue] = useState<TSortByValues>('rate');
    const [searchValue, setSearchValue] = useState<string>('');
    const [isFilterModalOpen, setIsFilterModalOpen] = useState<boolean>(false);
    const { data, isFetching, isLoading, loadMoreAdverts } = p2p.advert.useGetList({
        advertiser_name: searchValue,
        counterparty_type: activeTab === 'Buy' ? BUY_SELL.BUY : BUY_SELL.SELL,
        sort_by: sortDropdownValue,
    });

    const onToggle = (value: string) => {
        setSortDropdownValue(value as TSortByValues);
        setIsFilterModalOpen(false);
    };

    return (
        <div className='p2p-v2-buy-sell-table h-full w-full relative flex flex-col'>
            <BuySellHeader
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                setIsFilterModalOpen={setIsFilterModalOpen}
                setSearchValue={setSearchValue}
                setSortDropdownValue={setSortDropdownValue}
                sortDropdownValue={sortDropdownValue}
            />
            {isLoading ? (
                <Loader className='mt-80' />
            ) : (
                // TODO: Add empty state
                <Table
                    columns={columns}
                    data={data}
                    emptyDataMessage='There are no matching ads.'
                    isFetching={isFetching}
                    loadMoreFunction={loadMoreAdverts}
                    renderHeader={headerRenderer}
                    rowRender={(data: unknown) => <BuySellRowRenderer {...(data as TBuySellTableRowRenderer)} />}
                    tableClassname=''
                />
            )}
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
