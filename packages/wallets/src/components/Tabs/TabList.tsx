import React from 'react';
import { useTabs } from './Tabs';
import './TabList.scss';

type TTabListProps = {
    list: string[];
};

export const TabList = ({ list }: TTabListProps) => {
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
