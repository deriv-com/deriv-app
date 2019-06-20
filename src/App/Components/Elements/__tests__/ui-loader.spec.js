import React                  from 'react';
import { expect }             from 'chai';
import { configure, shallow } from 'enzyme';
import Adapter                from 'enzyme-adapter-react-16';
import UILoader               from '../ui-loader.jsx';

configure({ adapter: new Adapter() });

describe('UILoader', () => {
    it('should render one <UILoader /> component', () => {
        const wrapper = shallow(<UILoader />);
        expect(wrapper).to.have.length(1);
    });
    it('should have className passed in props', () => {
        const wrapper = shallow(<UILoader className='a-cool-classname'/>);
        expect(wrapper.find('.a-cool-classname').exists()).to.be.true;
    });
});
