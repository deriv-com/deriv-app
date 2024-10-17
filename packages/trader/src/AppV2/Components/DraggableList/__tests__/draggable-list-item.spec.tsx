import React from 'react';
import { render, screen } from '@testing-library/react';
import DraggableListItem from '../draggable-list-item';
import userEvent from '@testing-library/user-event';

describe('DraggableListItem', () => {
    it('renders with default icons', () => {
        render(<DraggableListItem title='Test Title' />);

        expect(screen.getByText('Test Title')).toBeInTheDocument();
    });

    it('renders with custom left and right icons', () => {
        const customLeftIcon = <span>Custom Left Icon</span>;
        const customRightIcon = <span>Custom Right Icon</span>;

        render(<DraggableListItem title='Test Title' leftIcon={customLeftIcon} rightIcon={customRightIcon} />);

        expect(screen.getByText('Custom Left Icon')).toBeInTheDocument();
        expect(screen.getByText('Custom Right Icon')).toBeInTheDocument();
    });

    it('calls onLeftIconClick when left icon is clicked', async () => {
        const handleLeftIconClick = jest.fn();

        render(<DraggableListItem title='Test Title' onLeftIconClick={handleLeftIconClick} />);

        const leftIcon = screen.getByTestId('dt_draggable_list_item_left_icon');

        await userEvent.click(leftIcon);

        expect(handleLeftIconClick).toHaveBeenCalledTimes(1);
    });

    it('calls onRightIconClick when right icon is clicked', async () => {
        const handleRightIconClick = jest.fn();

        render(<DraggableListItem title='Test Title' onRightIconClick={handleRightIconClick} />);

        const rightIcon = screen.getByTestId('dt_draggable_list_item_icon');

        await userEvent.click(rightIcon);

        expect(handleRightIconClick).toHaveBeenCalledTimes(1);
    });
});
