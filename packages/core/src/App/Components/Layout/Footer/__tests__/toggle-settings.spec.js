import React from 'react';
import { configure, shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { Modal } from '@deriv/components';
import { ToggleSettings } from '../toggle-settings.jsx';
import { Icon } from '@deriv/components';

configure({ adapter: new Adapter() });

describe('ToggleSettings', () => {
    it('should render one <ToggleSettings /> component with active class if is_settings_visible is true', () => {
        const wrapper = shallow(<ToggleSettings is_settings_visible={true} />);
        expect(wrapper).toHaveLength(1);
        expect(wrapper.find('.ic-settings--active').exists()).toBe(true);
    });
    it('should not have active class if is_settings_visible is false', () => {
        const wrapper = shallow(<ToggleSettings is_settings_visible={false} />);
        expect(wrapper.find('.ic-settings--active').exists()).toBe(false);
    });
    it("should contain <Icon icon='IcGear' />", () => {
        const wrapper = shallow(<ToggleSettings />);
        expect(wrapper.contains(<Icon icon='IcGear' className='footer__icon ic-settings__icon' />)).toBe(true);
    });
    it("property 'is_open' should depend on 'is_settings_visible'", () => {
        const wrapper = shallow(<ToggleSettings is_settings_visible={true} />);
        expect(wrapper.find(Modal).prop('is_open')).toBe(true);
    });
});
