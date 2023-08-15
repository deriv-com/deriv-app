import React from 'react';
import { render, screen } from '@testing-library/react';
import RadioGroupWithInfoMobile from '../radio-group-with-info-mobile';

jest.mock('@deriv/components', () => ({
    ...jest.requireActual('@deriv/components'),
    Popover: jest.fn(props => <div className={props.classNameBubble}>Popover</div>),
}));

describe('RadioGroupWithInfoMobile', () => {
    const props = {
        items_list: [
            { name: 'test name 1', value: 'test value 1' },
            { name: 'test name 2', value: 'test value 2' },
            { name: 'test name 3', value: 'test value 3' },
        ],
        contract_name: 'test_contract',
        current_value_object: { name: 'test name 2', value: 'test value 2' },
        onChange: jest.fn(),
        info: 'test info message',
        toggleModal: jest.fn(),
    };

    it('should render AccumulatorsProfitLossText', async () => {
        render(<RadioGroupWithInfoMobile {...props} />);

        const radio_options_arr_1 = screen.getAllByRole('radio');
        expect(radio_options_arr_1.length).toBe(3);
        expect(radio_options_arr_1[1].closest('label')).toHaveClass('dc-radio-group__item--selected');
        expect(radio_options_arr_1[0].closest('label')).not.toHaveClass('dc-radio-group__item--selected');
        expect(radio_options_arr_1[2].closest('label')).not.toHaveClass('dc-radio-group__item--selected');
        expect(radio_options_arr_1[1].value).toBe('test value 2');
    });
    it('should render popover components as children with proper classname', () => {
        render(<RadioGroupWithInfoMobile {...props} />);

        const popover = screen.getByText(/popover/i);
        expect(popover).toBeInTheDocument();
        expect(popover).toHaveClass('dc-popover__trade-params');
    });
});
