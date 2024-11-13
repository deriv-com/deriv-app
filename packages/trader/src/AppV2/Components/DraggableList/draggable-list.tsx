import React from 'react';
import { DragDropContext, Droppable, Draggable, DropResult, DragStart } from 'react-beautiful-dnd';
import DraggableListItem from './draggable-list-item';

export type TDraggableListItem = {
    id: string;
    title: string;
    icon?: React.ReactNode;
};

export type TDraggableListCategory = {
    id: string;
    title?: string;
    button_title?: string;
    items: TDraggableListItem[];
};

export type TDraggableListProps = {
    categories: TDraggableListCategory[];
    onRightIconClick: (item: TDraggableListItem) => void;
    onDrag?: (categories: TDraggableListCategory[]) => void;
    show_editing_divider?: boolean;
};

const DraggableList: React.FC<TDraggableListProps> = ({
    categories,
    onRightIconClick,
    onDrag,
    show_editing_divider,
}) => {
    const [category_list, setCategoryList] = React.useState(categories);
    const [draggedItemId, setDraggedItemId] = React.useState<string | null>(null);

    const handleOnDragEnd = (result: DropResult) => {
        setDraggedItemId(null);
        if (!result.destination) return;

        const new_category_list = updateCategoriesWithDragResult(category_list, result);
        setCategoryList(new_category_list);
        onDrag?.(new_category_list);
    };

    const handleOnDragStart = (start: DragStart) => setDraggedItemId(start.draggableId);

    React.useEffect(() => setCategoryList(categories), [categories]);
    return (
        <DragDropContext onDragEnd={handleOnDragEnd} onDragStart={handleOnDragStart}>
            {category_list.map(category => (
                <DraggableCategory
                    key={category.id}
                    category={category}
                    draggedItemId={draggedItemId}
                    onRightIconClick={onRightIconClick}
                    show_editing_divider={show_editing_divider}
                />
            ))}
        </DragDropContext>
    );
};

const DraggableCategory: React.FC<{
    category: TDraggableListCategory;
    draggedItemId: string | null;
    onRightIconClick: (item: TDraggableListItem) => void;
    show_editing_divider?: boolean;
}> = ({ category, draggedItemId, onRightIconClick, show_editing_divider }) => (
    <div className={show_editing_divider ? 'draggable-list-category' : ''}>
        <Droppable droppableId={category.id}>
            {provided => (
                <div
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    className='draggable-list-category__droppable-area'
                >
                    <DraggableCategoryItems
                        items={category.items}
                        draggedItemId={draggedItemId}
                        onRightIconClick={onRightIconClick}
                    />
                    {provided.placeholder}
                </div>
            )}
        </Droppable>
    </div>
);

const DraggableCategoryItems: React.FC<{
    items: TDraggableListItem[];
    draggedItemId: string | null;
    onRightIconClick: (item: TDraggableListItem) => void;
}> = ({ items, draggedItemId, onRightIconClick }) => {
    return (
        <>
            {items.map(
                (item, index) =>
                    item.id && (
                        <Draggable key={item.id} draggableId={item.id} index={index}>
                            {provided => (
                                <div
                                    ref={provided.innerRef}
                                    {...provided.draggableProps}
                                    {...provided.dragHandleProps}
                                    className='draggable-list-category__item'
                                >
                                    <DraggableListItem
                                        title={item.title}
                                        onRightIconClick={() => onRightIconClick(item)}
                                        active={draggedItemId === item.id}
                                        disabled={items.length === 1}
                                    />
                                </div>
                            )}
                        </Draggable>
                    )
            )}
        </>
    );
};

const updateCategoriesWithDragResult = (
    category_list: TDraggableListCategory[],
    result: DropResult
): TDraggableListCategory[] => {
    const { source, destination } = result;
    if (!destination) return category_list;

    const sourceIndex = category_list.findIndex(category => category.id === source.droppableId);
    const destIndex = category_list.findIndex(category => category.id === destination.droppableId);

    if (sourceIndex === -1 || destIndex === -1) return category_list;

    const sourceCategory = category_list[sourceIndex];
    const destCategory = category_list[destIndex];

    const sourceItems = Array.from(sourceCategory.items);
    const [movedItem] = sourceItems.splice(source.index, 1);

    if (sourceIndex === destIndex) {
        sourceItems.splice(destination.index, 0, movedItem);
    } else {
        const destItems = Array.from(destCategory.items);
        destItems.splice(destination.index, 0, movedItem);
        category_list[destIndex] = { ...destCategory, items: destItems };
    }

    category_list[sourceIndex] = { ...sourceCategory, items: sourceItems };
    return Array.from(category_list);
};

export default DraggableList;
