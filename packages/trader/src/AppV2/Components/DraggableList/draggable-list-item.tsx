import React from 'react';
import { StandaloneGripDotsVerticalBoldIcon, StandaloneCircleMinusFillIcon } from '@deriv/quill-icons';
import clsx from 'clsx';

type DraggableListItemProps = {
    active?: boolean;
    disabled?: boolean;
    leftIcon?: React.ReactNode;
    onLeftIconClick?: () => void;
    onRightIconClick?: () => void;
    rightIcon?: React.ReactNode;
    title: string;
};

const DraggableListItem: React.FC<DraggableListItemProps> = ({
    active,
    disabled,
    leftIcon,
    onLeftIconClick,
    onRightIconClick,
    rightIcon,
    title,
}) => {
    const default_left_icon = <StandaloneGripDotsVerticalBoldIcon iconSize='sm' />;
    const default_right_icon = <StandaloneCircleMinusFillIcon fill='var(--core-color-solid-red-700)' iconSize='sm' />;

    return (
        <div className={clsx('draggable-list-item', { 'draggable-list-item--active': active })}>
            <div className='draggable-list-item__left'>
                <div
                    className='draggable-list-item__left-icon'
                    data-testid='dt_draggable_list_item_left_icon'
                    onClick={onLeftIconClick}
                >
                    {leftIcon || default_left_icon}
                </div>
                <div className='draggable-list-item__title'>{title}</div>
            </div>
            <div
                className={clsx('draggable-list-item__icon', { 'draggable-list-item__icon--disabled': disabled })}
                data-testid='dt_draggable_list_item_icon'
                onClick={disabled ? undefined : onRightIconClick}
            >
                {rightIcon || default_right_icon}
            </div>
        </div>
    );
};

export default DraggableListItem;
