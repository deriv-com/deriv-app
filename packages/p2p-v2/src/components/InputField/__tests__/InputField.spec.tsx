import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import InputField from '../InputField';

jest.mock('@deriv-com/ui', () => ({
    ...jest.requireActual('@deriv-com/ui'),
    useDevice: () => ({
        isMobile: false,
    }),
}));

const mockProps = {
    isError: false,
    name: 'test',
    onBlur: jest.fn(),
    onChange: jest.fn(),
    type: 'number',
    value: 0,
};
describe('InputField', () => {
    it('should render the component as expected', () => {
        render(<InputField {...mockProps} />);
        expect(screen.getByDisplayValue('0')).toBeInTheDocument();
    });
    it('should handle onChange', () => {
        render(<InputField {...mockProps} />);
        const input = screen.getByDisplayValue('0');
        expect(input).toBeInTheDocument();
        userEvent.type(input, '1');
        expect(mockProps.onChange).toHaveBeenCalledTimes(1);
    });
    it('should handle increment change on plus button click', () => {
        render(<InputField {...mockProps} />);
        const plusButton = screen.getByTestId('dt_p2p_v2_input_field_increment');
        userEvent.click(plusButton);
        expect(mockProps.onChange).toHaveBeenCalled();
    });
    it('should handle decrement change on minus button click', () => {
        render(<InputField {...mockProps} />);
        const minusButton = screen.getByTestId('dt_p2p_v2_input_field_decrement');
        userEvent.click(minusButton);
        expect(mockProps.onChange).toHaveBeenCalled();
    });
    it('should handle onBlur', () => {
        render(<InputField {...mockProps} />);
        const input = screen.getByDisplayValue('0');
        userEvent.click(input);
        userEvent.tab();
        expect(mockProps.onBlur).toHaveBeenCalled();
    });
    it('should handle keyboard button press for increment', () => {
        render(<InputField {...mockProps} />);
        const input = screen.getByDisplayValue('0');
        userEvent.type(input, '{ArrowUp}');
        expect(mockProps.onChange).toHaveBeenCalled();
    });
    it('should handle keyboard button press for decrement', () => {
        render(<InputField {...mockProps} />);
        const input = screen.getByDisplayValue('0');
        userEvent.type(input, '{ArrowDown}');
        expect(mockProps.onChange).toHaveBeenCalled();
    });
});
