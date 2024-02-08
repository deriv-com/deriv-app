import React from 'react';
import { Button } from '@deriv-com/ui';
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
                <Button
                    className='p2p-v2-mobile-tabs__tab'
                    color='white'
                    icon={<RightArrowIcon />}
                    key={`${tab}-${i}`}
                    onClick={() => onChangeTab(tab)}
                    variant='contained'
                >
                    {tab}
                </Button>
            ))}
        </div>
    );
}

export default MobileTabs;
