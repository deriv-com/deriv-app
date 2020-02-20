import React from 'react';
import { expect } from 'chai';
import { configure, shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { UiLoader } from '@deriv/components';

configure({ adapter: new Adapter() });

describe('UiLoader', () => {
    it('should render one <UiLoader /> component', () => {
        const wrapper = shallow(<UiLoader />);
        expect(wrapper).to.have.length(1);
    });
    it('should have className passed in props', () => {
        const wrapper = shallow(<UiLoader className='a-cool-classname' />);
        expect(wrapper.find('.a-cool-classname').exists()).to.be.true;
    });
});
