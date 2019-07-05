import React                         from 'react';
import { expect }                    from 'chai';
import { spy, stub }                 from 'sinon';
import { configure, shallow, mount } from 'enzyme';
import Adapter                       from 'enzyme-adapter-react-16';
import { ToggleFullScreen }          from '../toggle-fullscreen.jsx';
import Icon                          from 'Assets/icon.jsx';

configure({ adapter: new Adapter() });
spy(ToggleFullScreen.prototype, 'componentDidMount');

describe('ToggleFullScreen', () => {
    it('should render one <ToggleFullScreen /> component', () => {
        const wrapper = shallow(<ToggleFullScreen  />);
        expect(wrapper).to.have.length(1);
    });
    it('should call componentWillMount', () => {
        shallow(<ToggleFullScreen  />);
        expect(ToggleFullScreen.prototype.componentDidMount).to.have.property('called', true);
    });
    it('should have .ic-fullscreen', () => {
        const wrapper = shallow(<ToggleFullScreen  />);
        expect(wrapper.find('.ic-fullscreen').exists()).to.be.true;
    });
    it('should not have .ic-fullscreen--active if it\'s false in state', () => {
        const wrapper = shallow(<ToggleFullScreen  />);
        expect(wrapper.find('.ic-fullscreen--active').exists()).to.be.false;
    });
    it('should have .ic-fullscreen--active if it\'s true in state', () => {
        const wrapper = shallow(<ToggleFullScreen  />);
        wrapper.setState({ is_full_screen: true });
        expect(wrapper.find('.ic-fullscreen--active').exists()).to.be.true;
    });
    it('should contain <Icon icon=\'IconMaximize\' />', () => {
        const wrapper = shallow(<ToggleFullScreen />);
        expect(wrapper.contains(<Icon icon='IconMaximize' className='footer__icon' />)).to.be.true;
    });
    it('should have onclick property as an instance of a Function', () => {
        const wrapper = shallow(<ToggleFullScreen />);
        expect(wrapper.prop('onClick')).to.be.an.instanceof(Function);
    });
    it('should set is_full_screen equal to false in state, after onclick, when is_full_screen is false and there is no browser', () => {
        const wrapper = shallow(<ToggleFullScreen />);
        wrapper.setState({ is_full_screen: false });
        wrapper.find('a').prop('onClick')({stopPropagation: () => {}});
        expect(wrapper.state().is_full_screen).to.be.false;
    });
    it('should set is_full_screen equal to false in state, after onclick, when is_full_screen is true and there is no browser', () => {
        const wrapper = shallow(<ToggleFullScreen />);
        wrapper.setState({ is_full_screen: true });
        wrapper.find('a').prop('onClick')({stopPropagation: () => {}});
        expect(wrapper.state().is_full_screen).to.be.false;
    });
    // TODO: write tests to make sure that the correct handler is being called whenever the relative event is triggered
});
