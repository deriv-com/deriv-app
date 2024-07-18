import React from 'react';
import { StandaloneCirclePlusFillIcon } from '@deriv/quill-icons';

type TradeTypeListItemProps = {
    title: string;
    leftIcon?: React.ReactNode;
    rightIcon?: React.ReactNode;
    onLeftIconClick?: () => void;
    onRightIconClick?: () => void;
};

const TradeTypeListItem: React.FC<TradeTypeListItemProps> = ({
    title,
    leftIcon,
    rightIcon,
    onLeftIconClick,
    onRightIconClick,
}) => {
    const default_icon = <StandaloneCirclePlusFillIcon fill='var(--core-color-solid-green-700)' iconSize='sm' />;

    return (
        <div className='trade-type-list-item'>
            {leftIcon && (
                <div className='trade-type-list-item__left-icon' onClick={onLeftIconClick}>
                    {leftIcon}
                </div>
            )}
            <div className='trade-type-list-item__title'>{title}</div>
            <div className='trade-type-list-item__icon' onClick={onRightIconClick}>
                {rightIcon || default_icon}
            </div>
        </div>
    );
};

export default TradeTypeListItem;
