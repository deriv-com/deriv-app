import React                  from 'react';
import { expect }             from 'chai';
import { configure, shallow } from 'enzyme';
import Adapter                from 'enzyme-adapter-react-16';
import { Link }               from 'react-router-dom';
import { ButtonLink }         from '../index';
import { testChildren }       from '../../../../test-helper';

configure({ adapter: new Adapter() });

describe('<ButtonLink />', () => {
    it('should render one <ButtonLink /> component', () => {
        const wrapper = shallow(<ButtonLink to='' />);
        expect(wrapper).to.have.length(1);
    });
    it('should render children when passed in', () => {
        testChildren(<ButtonLink to='' />);
    })
    it('should render one <Link />', () => {
        const wrapper = shallow(
            <ButtonLink to='' />
        );
        expect(wrapper.find(Link)).to.have.length(1);
    });
    it('should render component with className if any given', () => {
        const wrapper = shallow(
            <ButtonLink className='a-cool-classname' to='' />
        );
        expect(wrapper.find('.a-cool-classname').exists());
    });
});
