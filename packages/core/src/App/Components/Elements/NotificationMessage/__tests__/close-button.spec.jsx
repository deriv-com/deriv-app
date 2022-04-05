import React from 'react';
import { expect } from 'chai';
import { configure, shallow } from 'enzyme';
import Adapter from '@wojtekmaj/enzyme-adapter-react-17';
import CloseButton from '../close-button.jsx';

configure({ adapter: new Adapter() });

describe('CloseButton', () => {
    it('should render one <CloseButton /> component', () => {
        const wrapper = shallow(<CloseButton />);
        expect(wrapper).to.have.length(1);
    });
    it('should render one <CloseButton /> component', () => {
        const wrapper = shallow(<CloseButton />);
        expect(wrapper.prop('onClick').isRequired).to.be.true();
    });
});
