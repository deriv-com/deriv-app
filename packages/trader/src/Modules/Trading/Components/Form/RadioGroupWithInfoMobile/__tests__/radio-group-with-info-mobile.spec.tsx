import React from 'react';
import { render, screen } from '@testing-library/react';
import RadioGroupWithInfoMobile from '../radio-group-with-info-mobile';
import userEvent from '@testing-library/user-event';

jest.mock('@deriv/components', () => ({
    ...jest.requireActual('@deriv/components'),
    Popover: jest.fn(props => <div className={props.classNameBubble}>Popover</div>),
}));

describe('RadioGroupWithInfoMobile', () => {
    const props: React.ComponentProps<typeof RadioGroupWithInfoMobile> = {
        items_list: [
            { text: 'test name 1', value: 1 },
            { text: 'test name 2', value: 2 },
            { text: 'test name 3', value: 3 },
        ],
        contract_name: 'test_contract',
        current_value_object: { name: 'test name 2', value: 2 },
        onChange: jest.fn(),
        info: 'test info message',
        toggleModal: jest.fn(),
    };

    it('should render all radio buttons with their respective text and value', () => {
        render(<RadioGroupWithInfoMobile {...props} />);

        const radio_options_arr_1 = screen.getAllByRole<HTMLInputElement>('radio');
        expect(radio_options_arr_1).toHaveLength(3);
        expect(radio_options_arr_1[0].value).toBe('1');
        expect(radio_options_arr_1[1].value).toBe('2');
        expect(radio_options_arr_1[2].value).toBe('3');
        expect(screen.getByText(/test name 1/i)).toBeInTheDocument();
        expect(screen.getByText(/test name 2/i)).toBeInTheDocument();
        expect(screen.getByText(/test name 3/i)).toBeInTheDocument();
        expect(radio_options_arr_1[1].checked).toBeTruthy();
        expect(radio_options_arr_1[0].checked).toBeFalsy();
        expect(radio_options_arr_1[2].checked).toBeFalsy();
    });
    it('second radio option should be selected', () => {
        render(<RadioGroupWithInfoMobile {...props} />);

        const radio_options_arr_1 = screen.getAllByRole<HTMLInputElement>('radio');
        expect(radio_options_arr_1[1].checked).toBeTruthy();
        expect(radio_options_arr_1[0].checked).toBeFalsy();
        expect(radio_options_arr_1[2].checked).toBeFalsy();
    });
    it('first radio option should be selected when user selects and modal should be toggled after clicking', () => {
        render(<RadioGroupWithInfoMobile {...props} />);

        const radio_options_arr_1 = screen.getAllByRole<HTMLInputElement>('radio');
        userEvent.click(radio_options_arr_1[0]);
        expect(props.onChange).toHaveBeenCalled();
        expect(props.toggleModal).toHaveBeenCalled();
        expect(radio_options_arr_1[0].checked).toBeTruthy();
        expect(radio_options_arr_1[1].checked).toBeFalsy();
        expect(radio_options_arr_1[2].checked).toBeFalsy();
    });
    it('should render popover components as children with proper classname', () => {
        render(<RadioGroupWithInfoMobile {...props} />);

        const popover = screen.getByText(/popover/i);
        expect(popover).toBeInTheDocument();
        expect(popover).toHaveClass('dc-popover__trade-params');
    });
    it('should not render popover components if should_show_tooltip is falsy', () => {
        render(<RadioGroupWithInfoMobile {...props} should_show_tooltip={false} />);

        expect(screen.queryByText(/popover/i)).not.toBeInTheDocument();
    });
});
