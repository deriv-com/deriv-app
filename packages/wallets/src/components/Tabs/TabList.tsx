import React from 'react';
import { useTabs } from './Tabs';
import './TabList.scss';

type TTabListProps = {
    list: string[];
};

export const TabList = ({ list }: TTabListProps) => {
    const { active_tab_index, setActiveTabIndex } = useTabs();

    return (
        <div className='wallets-tabs-list' data-list-count={list.length}>
            {list.map((tab, i) => (
                <div
                    className={`wallets-tabs-list-item wallets-tabs-list-item--${
                        i === active_tab_index ? 'active' : 'disabled'
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
