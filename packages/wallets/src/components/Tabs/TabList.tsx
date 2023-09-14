import React from 'react';
import { useTabs } from './Tabs';
import './TabList.scss';

type TTabListProps = {
    list: string[];
    text_size: string;
};

export const TabList = ({ list, text_size = 's' }: TTabListProps) => {
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
                    style={{
                        fontSize: `var(--text-size-${text_size})`,
                    }}
                >
                    {tab}
                </div>
            ))}
        </div>
    );
};
