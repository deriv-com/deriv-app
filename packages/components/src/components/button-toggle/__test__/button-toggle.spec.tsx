import React from 'react';
import { render, screen, within } from '@testing-library/react';
import ButtonToggle from '../index';
import userEvent from '@testing-library/user-event';

describe('ButtonToggle component', () => {
    const mocked_props = {
        buttons_arr: [
            { text: 'Buy', value: 'BUY', count: 5 },
            { text: 'Sell', value: 'SELL' },
        ],
        className: '',
        has_rounded_button: false,
        id: 'button_toggle',
        is_traders_hub: false,
        is_animated: false,
        name: 'type',
        onChange: jest.fn(),
        value: 'BUY',
    };
    it('should render Buy and Sell buttons with 1 Counter inside Buy button', () => {
        render(<ButtonToggle {...mocked_props} />);
        const buy_button = screen.getByText(mocked_props.buttons_arr[0].text);
        const counter = within(buy_button).getByText('5');
        mocked_props.buttons_arr.forEach(button => {
            expect(screen.getByText(button.text)).toBeInTheDocument();
        });
        expect(counter).toBeInTheDocument();
    });
    it('should call onChange function when clicking on the button', () => {
        render(<ButtonToggle {...mocked_props} />);
        userEvent.click(screen.getByText(mocked_props.buttons_arr[1].text));
        expect(mocked_props.onChange).toHaveBeenCalledWith({
            target: { value: mocked_props.buttons_arr[1].value, name: mocked_props.name },
        });
    });
    it('should render the button with active class when the value is equal to the button value', () => {
        render(<ButtonToggle {...mocked_props} />);
        expect(screen.getByRole('button', { name: 'Buy 5' })).toHaveClass('dc-button-menu__button--active', {
            exact: false,
        });
    });
    it('should render a button toggle for traders_hub', () => {
        render(<ButtonToggle {...mocked_props} is_traders_hub />);
        expect(screen.getByRole('button', { name: 'Buy 5' })).toHaveClass('dc-button-menu__toggle--active', {
            exact: false,
        });
    });
    it('should render an animated highlighted button toggle with rounded button calling onChange when clicked', () => {
        render(<ButtonToggle {...mocked_props} is_animated has_rounded_button />);
        expect(screen.getByTestId('dt_highlight_rounded')).toBeInTheDocument();
        userEvent.click(screen.getByText(mocked_props.buttons_arr[1].text));
        expect(mocked_props.onChange).toHaveBeenCalledWith({
            target: { value: mocked_props.buttons_arr[1].value, name: mocked_props.name },
        });
    });
});
