import React from 'react';
import { render } from '@testing-library/react';
import DraggableListItem from '../draggable-list-item';
import userEvent from '@testing-library/user-event';

describe('DraggableListItem', () => {
    it('renders with default icons', () => {
        const { getByText } = render(<DraggableListItem title='Test Title' />);

        expect(getByText('Test Title')).toBeInTheDocument();
    });

    it('renders with custom left and right icons', () => {
        const customLeftIcon = <span>Custom Left Icon</span>;
        const customRightIcon = <span>Custom Right Icon</span>;

        const { getByText } = render(
            <DraggableListItem title='Test Title' leftIcon={customLeftIcon} rightIcon={customRightIcon} />
        );

        expect(getByText('Custom Left Icon')).toBeInTheDocument();
        expect(getByText('Custom Right Icon')).toBeInTheDocument();
    });

    it('calls onLeftIconClick when left icon is clicked', async () => {
        const handleLeftIconClick = jest.fn();
        const { container } = render(<DraggableListItem title='Test Title' onLeftIconClick={handleLeftIconClick} />);

        const leftIcon = container.querySelector('.draggable-list-item__left-icon');
        if (leftIcon) {
            await userEvent.click(leftIcon);
        }

        expect(handleLeftIconClick).toHaveBeenCalledTimes(1);
    });

    it('calls onRightIconClick when right icon is clicked', async () => {
        const handleRightIconClick = jest.fn();
        const { container } = render(<DraggableListItem title='Test Title' onRightIconClick={handleRightIconClick} />);

        const rightIcon = container.querySelector('.draggable-list-item__icon');
        if (rightIcon) {
            await userEvent.click(rightIcon);
        }

        expect(handleRightIconClick).toHaveBeenCalledTimes(1);
    });
});
