import React from 'react';
import { StandaloneBarsRegularIcon } from '@deriv/quill-icons';

interface DraggableListItemProps {
    title: string;
    icon?: React.ReactNode;
}

const DraggableListItem: React.FC<DraggableListItemProps> = ({ title, icon }) => {
    const defaultIcon = <StandaloneBarsRegularIcon iconSize='sm' />;

    return (
        <div className='draggable-list-item'>
            <div className='draggable-list-item__title'>{title}</div>
            <div className='draggable-list-item__icon'>{icon || defaultIcon}</div>
        </div>
    );
};

export default DraggableListItem;
