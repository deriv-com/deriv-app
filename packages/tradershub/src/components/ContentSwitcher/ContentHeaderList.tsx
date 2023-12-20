import React, { FC } from 'react';
import { Button, qtJoin, qtMerge } from '@deriv/quill-design';
import { useTabsContext } from './ContentSwitcher';

type TContentHeaderList = {
    className?: string;
    list: string[];
};

/**
 * List of of button headers for the content panels.
 * @param {TContentHeaderList} props The props for the component.
 * @returns {JSX.Element} The rendered component.
 */

const ContentHeaderList: FC<TContentHeaderList> = ({ className, list }) => {
    const { activeTabIndex, setActiveTabIndex } = useTabsContext();

    return (
        <div
            className={qtMerge('flex bg-system-light-secondary-background rounded-400 p-200 gap-200', className)}
            data-list-count={list.length}
        >
            {list.map((tab, i) => (
                <Button
                    className={qtJoin('rounded-200', i !== activeTabIndex && 'bg-transparent font-regular')}
                    colorStyle='white'
                    fullWidth
                    key={i}
                    onClick={() => setActiveTabIndex(i)}
                    size='lg'
                >
                    {tab}
                </Button>
            ))}
        </div>
    );
};

export default ContentHeaderList;
