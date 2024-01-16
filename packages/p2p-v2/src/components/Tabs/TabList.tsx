import React from 'react';
import { useTabs } from './Tabs';
import './TabList.scss';

type WalletPrimaryTabListProps = {
    list: string[];
};

const TabList = ({ list }: WalletPrimaryTabListProps) => {
    const { activeTabIndex, setActiveTabIndex } = useTabs();

    return (
        <div className='p2p-v2-tabs-list' data-list-count={list.length}>
            {list.map((tab, i) => (
                <button
                    className={`p2p-v2-tabs-list-item p2p-v2-tabs-list-item--${
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

export default TabList;
