import React from 'react';
import { useTabs } from './WalletsPrimaryTabs';
import './WalletsPrimaryTabList.scss';

type WalletPrimaryTabListProps = {
    list: string[];
};

const WalletsPrimaryTabList = ({ list }: WalletPrimaryTabListProps) => {
    const { activeTabIndex, setActiveTabIndex } = useTabs();

    return (
        <div className='wallets-tabs-list' data-list-count={list.length} data-testid='dt_tab_list'>
            {list.map((tab, i) => (
                <button
                    className={`wallets-tabs-list-item wallets-tabs-list-item--${
                        i === activeTabIndex ? 'active' : 'disabled'
                    }`}
                    key={i}
                    onClick={() => setActiveTabIndex(i)}
                >
                    {tab}
                </button>
            ))}
        </div>
    );
};

export default WalletsPrimaryTabList;
