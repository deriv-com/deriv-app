import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import DatePicker from '../index';

// TODO: add tests
describe('<DatePicker />', () => {
    it('should render one <DatePicker /> component', () => {
        const wrapper = shallow(<DatePicker />);
        expect(wrapper).to.have.length(1);
    });
});