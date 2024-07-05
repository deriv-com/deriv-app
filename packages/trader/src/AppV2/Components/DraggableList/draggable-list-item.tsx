import React from 'react';
import { StandaloneGripDotsVerticalBoldIcon, StandaloneCircleMinusFillIcon } from '@deriv/quill-icons';

type DraggableListItemProps = {
    title: string;
    leftIcon?: React.ReactNode;
    rightIcon?: React.ReactNode;
    onLeftIconClick?: () => void;
    onRightIconClick?: () => void;
}

const DraggableListItem: React.FC<DraggableListItemProps> = ({
    title,
    leftIcon,
    rightIcon,
    onLeftIconClick,
    onRightIconClick,
}) => {
    const default_left_icon = <StandaloneGripDotsVerticalBoldIcon iconSize='sm' />;
    const default_right_icon = <StandaloneCircleMinusFillIcon fill='var(--core-color-solid-red-700)' iconSize='sm' />;

    return (
        <div className='draggable-list-item'>
            <div className='draggable-list-item__left'>
                <div className='draggable-list-item__left-icon' onClick={onLeftIconClick}>
                    {leftIcon || default_left_icon}
                </div>
                <div className='draggable-list-item__title'>{title}</div>
            </div>
            <div className='draggable-list-item__icon' onClick={onRightIconClick}>
                {rightIcon || default_right_icon}
            </div>
        </div>
    );
};

export default DraggableListItem;
