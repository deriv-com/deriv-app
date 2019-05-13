import React                  from 'react';
import { expect }             from 'chai';
import { configure, shallow } from 'enzyme';
import Adapter                from 'enzyme-adapter-react-16';
import Tooltip                from '../tooltip.jsx';
import { testChildren }       from '../../../../test-helper';

configure({ adapter: new Adapter() });

describe('Tooltip', () => {
    it('should render one <Tooltip /> component', () => {
        const wrapper = shallow(<Tooltip />);
        expect(wrapper).to.have.length(1);
    });
    it('should render children when passed in', () => {
        testChildren(<Tooltip />);
    });
    it('should have class passed as icon prop', () => {
        const wrapper = shallow(<Tooltip icon='info' />);
        expect(wrapper.find('.info').exists()).to.be.true;
        expect(wrapper.find('.question').exists()).to.be.false;
    });
    it('should have data-tooltip equal to message passed in props', () => {
        const wrapper = shallow(<Tooltip message='This is a tooltip' />);
        expect(wrapper.prop('data-tooltip')).to.be.equal('This is a tooltip');
    });
    it('should have data-tooltip-pos equal to alignment passed in props', () => {
        const wrapper = shallow(<Tooltip alignment='right' />);
        expect(wrapper.prop('data-tooltip-pos')).to.be.equal('right');
    });
});
