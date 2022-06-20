import React from 'react';
import { render, screen } from '@testing-library/react';
import RadioButton from '../radio-button.jsx';

jest.mock('@deriv/components', () => {
    const original_module = jest.requireActual('@deriv/components');

    return {
        ...original_module,
        Icon: jest.fn(() => 'mockedIcon'),
        Popover: jest.fn(props => <span>{props.message}</span>),
    };
});

describe('<RadioButton />', () => {
    const props = {
        field: { name: 'test_radio', value: 'test_value', onChange: jest.fn(), onBlur: jest.fn() },
        id: 'test_radio_button',
    };

    const ust_msg =
        /send only tether omni to this deposit address\.sending tether erc20 to this address will result in the loss of your deposit\./i;

    const usdt_msg =
        /tether as an erc20 token \(eusdt\) is a version of tether that is hosted on ethereum, an open software platform where anyone can build and deploy decentralised applications\./i;

    it('should render radiobutton', () => {
        render(<RadioButton {...props} />);
        expect(
            screen.getByRole('radio', {
                name: /\(test_radio_button\)/i,
            })
        ).toBeInTheDocument();
    });

    it('should render icon if icons is passed', () => {
        render(
            <RadioButton {...props} icon='test_icon' label='sample_label' second_line_label='sample_second_label' />
        );
        expect(screen.getByText('mockedIcon')).toBeInTheDocument();
        expect(screen.getByText('sample_label')).toBeInTheDocument();
        expect(screen.getByText('sample_second_label')).toBeInTheDocument();
    });

    it('should render USTPopover if icons is not passed and id is UST', () => {
        render(<RadioButton {...props} id='UST' label='sample_label' />);
        expect(screen.getByText('mockedIcon')).toBeInTheDocument();
        expect(screen.getByText('sample_label')).toBeInTheDocument();
        expect(screen.getByText(ust_msg)).toBeInTheDocument();
    });

    it('should render USTPopover if icons is not passed and id is eUSDT', () => {
        render(<RadioButton {...props} id='eUSDT' label='sample_label' />);
        expect(screen.getByText('mockedIcon')).toBeInTheDocument();
        expect(screen.getByText('sample_label')).toBeInTheDocument();
        expect(screen.getByText(usdt_msg)).toBeInTheDocument();
    });
});
