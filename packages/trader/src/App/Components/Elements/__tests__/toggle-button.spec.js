import React                  from 'react';
import { expect }             from 'chai';
import { configure, shallow } from 'enzyme';
import Adapter                from 'enzyme-adapter-react-16';
import SwitchButton           from '../switch-button.jsx';

configure({ adapter: new Adapter() });

describe('SwitchButton', () => {
    it('should render one <SwitchButton /> component', () => {
        const wrapper = shallow(<SwitchButton />);
        expect(wrapper).to.have.length(1);
    });
    it('should have class equal to style passed in props', () => {
        const wrapper = shallow(<SwitchButton style='red' />);
        expect(wrapper.hasClass('red')).to.be.true;
    });
    it('should have switch-button class if style is not passed', () => {
        const wrapper = shallow(<SwitchButton />);
        expect(wrapper.hasClass('switch-button')).to.be.true;
    });
    it('should have class .switch-button--toggled if toggled is passed true in props', () => {
        const wrapper = shallow(<SwitchButton toggled={true} />);
        expect(wrapper.find('.switch-button--toggled').exists()).to.be.true;
    });
    it('should not have .switch-button--toggled if toggled is passed false in props', () => {
        const wrapper = shallow(<SwitchButton toggled={false} />);
        expect(wrapper.find('.switch-button--toggled').exists()).to.be.false;
    });
    it('should not have .switch-button--toggled if toggled is not passed in props', () => {
        const wrapper = shallow(<SwitchButton />);
        expect(wrapper.find('.switch-button--toggled').exists()).to.be.false;
    });
});
