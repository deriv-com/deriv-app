// TODO refactor old tests in this component
import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { Modal, Icon } from '@deriv/components';
import { ToggleSettings } from '../toggle-settings.jsx';

const mockFunction = jest.fn();

describe('ToggleSettings Component', () => {
    it('should has "ic-settings--active" class when "is_settings_visible" is true', () => {
        render(<ToggleSettings is_settings_visible />);
        const aElement = screen.getByTestId('dt_settings_toggle');
        expect(aElement).toHaveClass('ic-settings--active');
    });

    // it('should open the modal when the user clicked on the link', () => {
    //     render(<ToggleSettings toggleSettings={mockFunction} />);
    //     const aElement = screen.getByTestId('dt_settings_toggle');
    //     fireEvent.click(aElement);
    //     const modal = screen.getByTestId('');
    //     // expect(modal).
    // });

    // it('should contain "IcGear" icon', () => {
    //     render(<ToggleSettings />);
    //     const icon = screen.getByText('IcGear');
    //     // expect(icon).toBeInTheDocument();
    // });

    // it('should render one <ToggleSettings /> component with active class if is_settings_visible is true', () => {
    //     const wrapper = shallow(<ToggleSettings is_settings_visible={true} />);
    //     expect(wrapper).toHaveLength(1);
    //     expect(wrapper.find('.ic-settings--active').exists()).toBe(true);
    // });

    // it("property 'is_open' should depend on 'is_settings_visible'", () => {
    //     const wrapper = shallow(<ToggleSettings is_settings_visible={true} />);
    //     expect(wrapper.find(Modal).prop('is_open')).toBe(true);
    // });
});
