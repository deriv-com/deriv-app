import React from 'react';
import { expect } from 'chai';
import { configure, shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { ToggleFullScreen } from '../toggle-fullscreen.jsx';
import { Icon } from '@deriv/components';

configure({ adapter: new Adapter() });

describe('ToggleFullScreen', () => {
    it('should render one <ToggleFullScreen /> component', () => {
        const wrapper = shallow(<ToggleFullScreen />);
        expect(wrapper).to.have.length(1);
    });
    it('should have .ic-fullscreen', () => {
        const wrapper = shallow(<ToggleFullScreen />);
        expect(wrapper.find('.ic-fullscreen').exists()).to.be.true;
    });
    it("should not have .ic-fullscreen--active if it's false in state", () => {
        const wrapper = shallow(<ToggleFullScreen />);
        expect(wrapper.find('.ic-fullscreen--active').exists()).to.be.false;
    });
    it("should contain <Icon icon='IcMaximize' />", () => {
        const wrapper = shallow(<ToggleFullScreen />);
        expect(wrapper.contains(<Icon icon='IcFullScreen' className='footer__icon' />)).to.be.true;
    });
});
