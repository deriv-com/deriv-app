import React from 'react';
import { StandaloneCirclePlusFillIcon } from '@deriv/quill-icons';
import clsx from 'clsx';

type TTradeTypeListItemProps = {
    title: string;
    selected?: boolean;
    leftIcon?: React.ReactNode;
    rightIcon?: React.ReactNode;
    onLeftIconClick?: () => void;
    onRightIconClick?: () => void;
    onTradeTypeClick?: (e: React.MouseEvent<HTMLElement> | React.KeyboardEvent<HTMLElement>) => void;
};

const TradeTypeListItem: React.FC<TTradeTypeListItemProps> = ({
    title,
    selected,
    leftIcon,
    rightIcon,
    onLeftIconClick,
    onRightIconClick,
    onTradeTypeClick,
}) => {
    const default_icon = <StandaloneCirclePlusFillIcon fill='var(--core-color-solid-green-700)' iconSize='sm' />;

    return (
        <div
            className={clsx('trade-type-list-item', { 'trade-type-list-item--selected': selected })}
            onClick={onTradeTypeClick}
            onKeyDown={onTradeTypeClick}
        >
            {leftIcon && (
                <button
                    className='trade-type-list-item__left-icon'
                    data-testid='dt_trade_type_list_item_left_icon'
                    onClick={onLeftIconClick}
                >
                    {leftIcon}
                </button>
            )}
            <div className='trade-type-list-item__title'>{title}</div>
            {onRightIconClick && (
                <button
                    className='trade-type-list-item__icon'
                    data-testid='dt_trade_type_list_item_right_icon'
                    onClick={onRightIconClick}
                >
                    {rightIcon || default_icon}
                </button>
            )}
        </div>
    );
};

export default TradeTypeListItem;
