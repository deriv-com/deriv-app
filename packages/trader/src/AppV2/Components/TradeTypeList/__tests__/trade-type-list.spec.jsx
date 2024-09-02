import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import TradeTypeList from '../trade-type-list';

jest.mock('../trade-type-list-item', () => {
    const MockedComponent = ({ title, onRightIconClick }) => <div onClick={onRightIconClick}>{title}</div>;
    MockedComponent.displayName = 'TradeTypeListItem';
    return MockedComponent;
});

describe('TradeTypeList', () => {
    const categories = [
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

    it('renders categories and items correctly', () => {
        render(<TradeTypeList categories={categories} onRightIconClick={jest.fn()} />);

        expect(screen.getByText('Category 1')).toBeInTheDocument();
        expect(screen.getByText('Category 2')).toBeInTheDocument();
        expect(screen.getByText('Item 1')).toBeInTheDocument();
        expect(screen.getByText('Item 2')).toBeInTheDocument();
        expect(screen.getByText('Item 3')).toBeInTheDocument();
        expect(screen.getByText('Item 4')).toBeInTheDocument();
    });

    it('calls onRightIconClick when an item is clicked', async () => {
        const handle_right_icon_click = jest.fn();
        render(<TradeTypeList categories={categories} onRightIconClick={handle_right_icon_click} />);

        const item_1 = screen.getByText('Item 1');
        await userEvent.click(item_1);

        expect(handle_right_icon_click).toHaveBeenCalledWith(categories[0].items[0]);

        const item_3 = screen.getByText('Item 3');
        await userEvent.click(item_3);

        expect(handle_right_icon_click).toHaveBeenCalledWith(categories[1].items[0]);
    });
});
