import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import SellButton from '../sell-button';

const mocked_props = {
    contract_info: { validation_error: 'test text' },
    is_sell_requested: true,
    is_valid_to_sell: true,
    onClickSell: jest.fn(),
};

describe('SellButton', () => {
    it('should render SellButton component', () => {
        render(<SellButton {...mocked_props} />);
        expect(screen.getByText(/sell/i)).toBeInTheDocument();
    });
    it('should render disabled button if the result of (!is_valid_to_sell || is_sell_requested) is true', () => {
        render(<SellButton {...mocked_props} />);
        const button = screen.getByRole('button');
        userEvent.click(button);

        expect(mocked_props.onClickSell).not.toBeCalled();
        expect(button).toBeDisabled();
    });
    it('should render enabled button if the result of (!is_valid_to_sell || is_sell_requested) is false', () => {
        mocked_props.is_sell_requested = false;
        render(<SellButton {...mocked_props} />);
        const button = screen.getByRole('button');
        userEvent.click(button);

        expect(mocked_props.onClickSell).toBeCalled();
        expect(button).toBeEnabled();
    });
    it('should show default tooltip text if is_valid_to_sell === true', () => {
        render(<SellButton {...mocked_props} />);
        const tooltip_icon_wrapper = screen.getByTestId('dt_popover_wrapper');
        userEvent.hover(tooltip_icon_wrapper);

        expect(screen.getByText(/contract will be sold/i)).toBeInTheDocument();
    });
    it('should show specific tooltip text if is_valid_to_sell === false', () => {
        mocked_props.is_valid_to_sell = false;
        render(<SellButton {...mocked_props} />);
        const tooltip_icon_wrapper = screen.getByTestId('dt_popover_wrapper');
        userEvent.hover(tooltip_icon_wrapper);

        expect(screen.getByText(mocked_props.contract_info.validation_error)).toBeInTheDocument();
    });
});
