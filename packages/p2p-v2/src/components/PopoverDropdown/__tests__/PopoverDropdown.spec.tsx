import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import PopoverDropdown from '../PopoverDropdown';

jest.mock('@deriv-com/ui', () => ({
    ...jest.requireActual('@deriv-com/ui'),
    useDevice: () => ({
        isMobile: false,
    }),
}));

const mockProps = {
    dropdownList: [
        {
            label: 'label 1',
            value: 'value 1',
        },
        {
            label: 'label 2',
            value: 'value 2',
        },
    ],
    onClick: jest.fn(),
    tooltipMessage: 'test tooltip message',
};

describe('PopoverDropdown', () => {
    it('should render', () => {
        render(<PopoverDropdown {...mockProps} />);
        expect(screen.getByTestId('dt_p2p_v2_popover_dropdown_icon')).toBeInTheDocument();
    });
    it('should render the dropdown list on clicking on the icon', () => {
        render(<PopoverDropdown {...mockProps} />);
        userEvent.click(screen.getByTestId('dt_p2p_v2_popover_dropdown_icon'));
        expect(screen.getByText('label 1')).toBeInTheDocument();
    });
    it('should call onClick when item is clicked', () => {
        render(<PopoverDropdown {...mockProps} />);
        userEvent.click(screen.getByTestId('dt_p2p_v2_popover_dropdown_icon'));
        userEvent.click(screen.getByText('label 1'));
        expect(mockProps.onClick).toHaveBeenCalledWith('value 1');
    });
});
