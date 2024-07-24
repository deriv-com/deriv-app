import React from 'react';
import { StandaloneCirclePlusFillIcon } from '@deriv/quill-icons';

type TTradeTypeListItemProps = {
    title: string;
    leftIcon?: React.ReactNode;
    rightIcon?: React.ReactNode;
    onLeftIconClick?: () => void;
    onRightIconClick?: () => void;
};

const TradeTypeListItem: React.FC<TTradeTypeListItemProps> = ({
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
                <button className='trade-type-list-item__left-icon' onClick={onLeftIconClick}>
                    {leftIcon}
                </button>
            )}
            <div className='trade-type-list-item__title'>{title}</div>
            <button className='trade-type-list-item__icon' onClick={onRightIconClick}>
                {rightIcon || default_icon}
            </button>
        </div>
    );
};

export default TradeTypeListItem;
