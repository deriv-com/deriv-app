import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import NumberSelector from '../number-selector';

const tests_arr_arr_numbers = [
    [1, 2, 3],
    [4, 5, 6],
];
const mock_props = {
    arr_arr_numbers: tests_arr_arr_numbers,
    name: 'test name',
    onChange: jest.fn(),
};

describe('NumberSelector', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should render all members of arr_arr_numbers', () => {
        render(<NumberSelector {...mock_props} />);

        tests_arr_arr_numbers.flat().forEach(number => expect(screen.getByText(number)).toBeInTheDocument());
    });
    it('should render all members of arr_arr_numbers with percentage if should_show_in_percents === true', () => {
        render(<NumberSelector {...mock_props} should_show_in_percents />);

        tests_arr_arr_numbers
            .flat()
            .forEach(number => expect(screen.getByText(`${number * 100}%`)).toBeInTheDocument());
    });
    it('should call onChange function if user clicks not on the selected value', () => {
        render(<NumberSelector {...mock_props} selected_number={2} />);
        userEvent.click(screen.getByText('3'));

        expect(mock_props.onChange).toHaveBeenCalled();
        expect(mock_props.onChange).toHaveBeenCalledWith({ target: { name: 'test name', value: 3 } });
    });
    it('should not call onChange function if user clicks on the selected value', () => {
        render(<NumberSelector {...mock_props} selected_number={2} />);
        userEvent.click(screen.getByText('2'));

        expect(mock_props.onChange).not.toHaveBeenCalled();
    });
});
