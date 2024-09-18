import React, { ComponentProps, FC, useCallback } from 'react';
import classNames from 'classnames';
import { Text } from '@deriv-com/ui';

export type TabTitleProps = {
    icon?: React.ReactNode;
    index: number;
    isActive?: boolean;
    setSelectedTab: (index: number) => void;
    size: ComponentProps<typeof Text>['size'];
    title: string;
};

const TabTitle: FC<TabTitleProps> = ({ icon, index, isActive, setSelectedTab, size = 'md', title }) => {
    const handleOnClick = useCallback(() => {
        setSelectedTab(index);
    }, [setSelectedTab, index]);

    return (
        <button
            className={classNames('wallets-tabs__btn', {
                'wallets-tabs__btn--active': isActive,
            })}
            onClick={handleOnClick}
        >
            {icon}
            <Text size={size} weight={isActive ? 'bold' : 'normal'}>
                {title}
            </Text>
        </button>
    );
};

export default TabTitle;
