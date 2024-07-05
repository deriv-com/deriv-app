import React, { useState } from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';
import { Text } from '@deriv-com/quill-ui';
import DraggableListItem from './draggable-list-item';

export type DraggableListItem = {
    id: string;
    title: string;
    icon?: React.ReactNode;
}

export type DraggableListCategory = {
    id: string;
    title?: string;
    items: DraggableListItem[];
}

export type DraggableListProps = {
    categories: DraggableListCategory[];
    onRightIconClick: (item: DraggableListItem) => void;
}

const DraggableList: React.FC<DraggableListProps> = ({ categories, onRightIconClick }) => {
    const [category_list, setCategoryList] = useState(categories);

    const handleOnDragEnd = (result: DropResult) => {
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

        if (source_category_index === dest_category_index) {
            source_items.splice(result.destination.index, 0, moved_item);
            const new_category_list = Array.from(category_list);
            new_category_list[source_category_index] = {
                ...source_category,
                items: source_items,
            };
            setCategoryList(new_category_list);
        } else {
            const dest_items = Array.from(dest_category.items);
            dest_items.splice(result.destination.index, 0, moved_item);

            const new_category_list = Array.from(category_list);
            new_category_list[source_category_index] = {
                ...source_category,
                items: source_items,
            };
            new_category_list[dest_category_index] = {
                ...dest_category,
                items: dest_items,
            };

            setCategoryList(new_category_list);
        }
    };

    React.useEffect(() => {
        setCategoryList(categories);
    }, [categories]);

    return (
        <DragDropContext onDragEnd={handleOnDragEnd}>
            {category_list.map(category => (
                <div key={category.id} className='draggable-list-category'>
                    <Text size='sm' bold className='draggable-list-category-title'>
                        {category.title}
                    </Text>
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
                                            >
                                                <DraggableListItem
                                                    title={item.title}
                                                    onRightIconClick={() => onRightIconClick(item)}
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
