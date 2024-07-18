import React, { useState } from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';
import { Text } from '@deriv-com/quill-ui';
import DraggableListItem from './draggable-list-item';
import { Localize } from '@deriv/translations';

export type DraggableListItem = {
    id: string;
    title: string;
    icon?: React.ReactNode;
};

export type DraggableListCategory = {
    id: string;
    title?: string;
    button_title?: string;
    items: DraggableListItem[];
};

export type DraggableListProps = {
    categories: DraggableListCategory[];
    onRightIconClick: (item: DraggableListItem) => void;
    onSave?: () => void;
    onDrag?: (categories: DraggableListCategory[]) => void;
};

const DraggableList: React.FC<DraggableListProps> = ({ categories, onRightIconClick, onSave, onDrag }) => {
    const [category_list, setCategoryList] = useState(categories);
    const [draggedItemId, setDraggedItemId] = useState<string | null>(null);

    const handleOnDragEnd = (result: DropResult) => {
        setDraggedItemId(null);
        if (!result.destination) return;

        const source_category_index = category_list.findIndex(category => category.id === result.source.droppableId);
        const dest_category_index = category_list.findIndex(
            category => category.id === result.destination?.droppableId
        );

        if (source_category_index === -1 || dest_category_index === -1) return;

        const source_category = category_list[source_category_index];
        const dest_category = category_list[dest_category_index];

        const source_items = Array.from(source_category.items);
        const [moved_item] = source_items.splice(result.source.index, 1);
        const new_category_list = Array.from(category_list);

        if (source_category_index === dest_category_index) {
            source_items.splice(result.destination.index, 0, moved_item);
        } else {
            const dest_items = Array.from(dest_category.items);
            dest_items.splice(result.destination.index, 0, moved_item);
            new_category_list[dest_category_index] = {
                ...dest_category,
                items: dest_items,
            };
        }

        new_category_list[source_category_index] = {
            ...source_category,
            items: source_items,
        };
        setCategoryList(new_category_list);
        onDrag && onDrag(new_category_list);
    };

    const handleOnDragStart = (start: any) => {
        setDraggedItemId(start.draggableId);
    };

    React.useEffect(() => {
        setCategoryList(categories);
    }, [categories]);

    return (
        <DragDropContext onDragEnd={handleOnDragEnd} onDragStart={handleOnDragStart}>
            {category_list.map(category => (
                <div key={category.id} className='draggable-list-category'>
                    <div className='draggable-list-category-header'>
                        <Text size='sm' bold className='draggable-list-category-header-title'>
                            {category.title}
                        </Text>
                        {onSave && (
                            <Text
                                size='sm'
                                bold
                                underlined
                                className='draggable-list-category-header-button'
                                onClick={onSave}
                            >
                                {category.button_title || <Localize i18n_default_text='Done' />}
                            </Text>
                        )}
                    </div>
                    <Droppable droppableId={category.id}>
                        {provided => (
                            <div
                                {...provided.droppableProps}
                                ref={provided.innerRef}
                                className='draggable-list-category__droppable-area'
                            >
                                {category.items.map((item, index) => (
                                    <Draggable key={item.id} draggableId={item.id} index={index}>
                                        {provided => (
                                            <div
                                                ref={provided.innerRef}
                                                {...provided.draggableProps}
                                                {...provided.dragHandleProps}
                                                className={`draggable-list-category__item ${
                                                    draggedItemId === item.id ? 'is-clicked' : ''
                                                }`}
                                            >
                                                <DraggableListItem
                                                    title={item.title}
                                                    onRightIconClick={() => onRightIconClick(item)}
                                                    active={draggedItemId === item.id}
                                                    disabled={category.items.length === 1}
                                                />
                                            </div>
                                        )}
                                    </Draggable>
                                ))}
                                {provided.placeholder}
                            </div>
                        )}
                    </Droppable>
                </div>
            ))}
        </DragDropContext>
    );
};

export default DraggableList;
