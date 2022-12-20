import React from 'react';
import { expect } from 'chai';
import { configure, shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { Button } from '@deriv/components';
import { LoginButton } from '../login-button.jsx';

configure({ adapter: new Adapter() });

describe('LoginButton', () => {
    it('should render one <LoginButton /> component', () => {
        const wrapper = shallow(<LoginButton />);
        expect(wrapper).to.have.length(1);
    });
    it('should have Button', () => {
        const wrapper = shallow(<LoginButton />);
        expect(wrapper.find(Button).exists()).to.be.true;
    });
    it('should have onClick prop of Button as an instance of Function', () => {
        const wrapper = shallow(<LoginButton />);
        expect(wrapper.find(Button).prop('onClick')).to.be.an.instanceof(Function);
    });
});
