import React, { FC, useCallback } from 'react';
import classNames from 'classnames';
import WalletText, { WalletTextProps } from '../WalletText/WalletText';

export type TabTitleProps = {
    icon?: React.ReactNode;
    index: number;
    isActive?: boolean;
    setSelectedTab: (index: number) => void;
    size: WalletTextProps['size'];
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
            <WalletText size={size} weight={isActive ? 'bold' : 'normal'}>
                {title}
            </WalletText>
        </button>
    );
};

export default TabTitle;
