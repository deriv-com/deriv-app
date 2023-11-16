import React from 'react';
import { useTabs } from './WalletsPrimaryTabs';
import './WalletsPrimaryTabList.scss';

type TTabListProps = {
    list: string[];
};

const WalletsPrimaryTabList = ({ list }: TTabListProps) => {
    const { activeTabIndex, setActiveTabIndex } = useTabs();

    return (
        <div className='wallets-tabs-list' data-list-count={list.length}>
            {list.map((tab, i) => (
                <div
                    className={`wallets-tabs-list-item wallets-tabs-list-item--${
                        i === activeTabIndex ? 'active' : 'disabled'
                    }`}
                    key={i}
                    onClick={() => setActiveTabIndex(i)}
                >
                    {tab}
                </div>
            ))}
        </div>
    );
};

export default WalletsPrimaryTabList;
