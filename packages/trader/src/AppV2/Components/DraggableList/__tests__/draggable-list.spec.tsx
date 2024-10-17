import React from 'react';
import { screen, render, RenderResult } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import DraggableList, { TDraggableListProps, TDraggableListCategory } from '../draggable-list';

jest.mock('react-beautiful-dnd', () => ({
    DragDropContext: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
    Droppable: ({ children }: { children: (provided: any) => React.ReactNode }) => (
        <div>{children({ droppableProps: {}, innerRef: jest.fn(), placeholder: null })}</div>
    ),
    Draggable: ({ children }: { children: (provided: any) => React.ReactNode }) => (
        <div>{children({ draggableProps: {}, dragHandleProps: {}, innerRef: jest.fn() })}</div>
    ),
}));

describe('DraggableList', () => {
    const categories: TDraggableListCategory[] = [
        {
            id: 'category1',
            title: 'Category 1',
            items: [
                { id: 'item1', title: 'Item 1' },
                { id: 'item2', title: 'Item 2' },
            ],
        },
        {
            id: 'category2',
            title: 'Category 2',
            items: [
                { id: 'item3', title: 'Item 3' },
                { id: 'item4', title: 'Item 4' },
            ],
        },
    ];

    const renderComponent = (props: Partial<TDraggableListProps> = {}): RenderResult =>
        render(<DraggableList categories={categories} onRightIconClick={jest.fn()} {...props} />);

    it('renders categories and items correctly', () => {
        renderComponent();

        expect(screen.getByText('Category 1')).toBeInTheDocument();
        expect(screen.getByText('Category 2')).toBeInTheDocument();
        expect(screen.getByText('Item 1')).toBeInTheDocument();
        expect(screen.getByText('Item 2')).toBeInTheDocument();
        expect(screen.getByText('Item 3')).toBeInTheDocument();
        expect(screen.getByText('Item 4')).toBeInTheDocument();
    });

    it('calls onRightIconClick when the right icon of an item is clicked', async () => {
        const handleRightIconClick = jest.fn();

        renderComponent({ onRightIconClick: handleRightIconClick });

        const rightIcons = screen.getAllByTestId('dt_draggable_list_item_icon');

        if (rightIcons[0]) {
            await userEvent.click(rightIcons[0]);
        }

        expect(handleRightIconClick).toHaveBeenCalledWith(categories[0].items[0]);
    });
});
