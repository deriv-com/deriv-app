import React from 'react';
import { render, screen } from '@testing-library/react';
import RadioButton, { TRadioButton } from '../radio-button';

jest.mock('@deriv/components', () => {
    const original_module = jest.requireActual('@deriv/components');

    return {
        ...original_module,
        Icon: jest.fn(() => 'mockedIcon'),
        Popover: jest.fn(props => <span>{props.message}</span>),
    };
});

describe('<RadioButton />', () => {
    const props: TRadioButton = {
        field: { name: 'test_radio', value: 'test_value', onChange: jest.fn(), onBlur: jest.fn() },
        id: 'test_radio_button',
        label: 'test',
    };

    const ust_msg =
        /Tether as an Omni token \(USDT\) is a version of Tether that is hosted on the Omni layer on the Bitcoin blockchain./i;

    const usdt_msg = /Tether as an ERC20 token \(eUSDT\) is a version of Tether that is hosted on Ethereum./i;

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
