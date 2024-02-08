import React from 'react';
import { LabelPairedChevronRightLgBoldIcon } from '@deriv/quill-icons';
import { Text } from '@deriv-com/ui';
import './MobileTabs.scss';

type TMobileTabsProps<T extends string[]> = {
    onChangeTab: (clickedTab: T[number]) => void;
    tabs: T;
};

function MobileTabs<T extends string[]>({ onChangeTab, tabs }: TMobileTabsProps<T>) {
    return (
        <div className='p2p-v2-mobile-tabs'>
            {tabs.map((tab, i) => (
                <button className='p2p-v2-mobile-tabs__tab' key={`${tab}-${i}`} onClick={() => onChangeTab(tab)}>
                    <Text size='sm'>{tab}</Text>
                    <LabelPairedChevronRightLgBoldIcon />
                </button>
            ))}
        </div>
    );
}

export default MobileTabs;
