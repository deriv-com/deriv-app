import React from 'react';
import { LabelPairedChevronRightLgBoldIcon } from '@deriv/quill-icons';
import { Button } from '@deriv-com/ui';
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
                    icon={<LabelPairedChevronRightLgBoldIcon />}
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
