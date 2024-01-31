import React from 'react';
import { Text } from '@deriv-com/ui/dist/components/Text';
import RightArrowIcon from '../../public/ic-chevron-right.svg';
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
                    <RightArrowIcon />
                </button>
            ))}
        </div>
    );
}

export default MobileTabs;
