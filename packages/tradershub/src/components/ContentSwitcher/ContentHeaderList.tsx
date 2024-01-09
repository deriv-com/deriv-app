import React, { ComponentProps, FC, memo } from 'react';
import { Button, qtJoin, qtMerge } from '@deriv/quill-design';
import { useContentSwitch } from './ContentSwitcher';

type TContentHeaderList = {
    className?: string;
    list: string[];
    size?: ComponentProps<typeof Button>['size'];
};

/**
 * List of button headers for the content panels.
 * @param {TContentHeaderList} props The props for the component.
 * @returns {JSX.Element} The rendered component.
 */
const ContentHeaderList: FC<TContentHeaderList> = memo(({ className, list, size }) => {
    const { activeTabIndex, setActiveTabIndex } = useContentSwitch();

    return (
        <div
            className={qtMerge('flex bg-system-light-secondary-background rounded-400 p-200 gap-200', className)}
            data-list-count={list.length}
        >
            {list.map((tabLabel, index) => (
                <Button
                    className={qtJoin('rounded-200', index !== activeTabIndex && 'bg-transparent font-regular')}
                    colorStyle='white'
                    fullWidth
                    key={`tradershub-tab-${tabLabel}`}
                    onClick={() => setActiveTabIndex(index)}
                    size={size}
                >
                    {tabLabel}
                </Button>
            ))}
        </div>
    );
});

ContentHeaderList.displayName = 'ContentHeaderList';
export default ContentHeaderList;
