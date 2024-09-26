import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import TradeTypeListItem from '../trade-type-list-item';

describe('TradeTypeListItem', () => {
    it('renders with default right icon', () => {
        const handle_right_icon_click = jest.fn();
        render(<TradeTypeListItem title='Test Title' onRightIconClick={handle_right_icon_click} />);

        expect(screen.getByText('Test Title')).toBeInTheDocument();
        expect(screen.getByRole('img')).toBeInTheDocument();
    });

    it('renders with custom left and right icons', () => {
        const custom_left_icon = <span>Custom Left Icon</span>;
        const custom_right_icon = <span>Custom Right Icon</span>;
        const handle_right_icon_click = jest.fn();

        render(
            <TradeTypeListItem
                title='Test Title'
                leftIcon={custom_left_icon}
                rightIcon={custom_right_icon}
                onRightIconClick={handle_right_icon_click}
            />
        );

        expect(screen.getByText('Custom Left Icon')).toBeInTheDocument();
        expect(screen.getByText('Custom Right Icon')).toBeInTheDocument();
    });

    it('calls onLeftIconClick when left icon is clicked', async () => {
        const handle_left_icon_click = jest.fn();

        render(
            <TradeTypeListItem
                title='Test Title'
                leftIcon={<span>Left Icon</span>}
                onLeftIconClick={handle_left_icon_click}
            />
        );

        const left_icon = screen.getByText('Left Icon');
        await userEvent.click(left_icon);

        expect(handle_left_icon_click).toHaveBeenCalledTimes(1);
    });

    it('calls onRightIconClick when right icon is clicked', async () => {
        const handle_right_icon_click = jest.fn();

        render(<TradeTypeListItem title='Test Title' onRightIconClick={handle_right_icon_click} />);

        const right_icon = screen.getByRole('img');
        await userEvent.click(right_icon);

        expect(handle_right_icon_click).toHaveBeenCalledTimes(1);
    });
});
