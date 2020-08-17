import React from 'react';
import { expect } from 'chai';
import { configure, shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { NavLink } from 'react-router-dom';
import { routes } from '@deriv/shared';
import { BinaryLink } from '../index';

configure({ adapter: new Adapter() });

describe('<BinaryLink />', () => {
    it('should render one <BinaryLink /> component', () => {
        const wrapper = shallow(<BinaryLink />);
        expect(wrapper).to.have.length(1);
    });
    it('should render children when passed in', () => {
        const child_div = <div className='sweet-child-of-mine' />;
        const wrapper = shallow(<BinaryLink>{child_div}</BinaryLink>);
        expect(wrapper.contains(child_div)).to.equal(true);
    });
    it("should render one <Navlink /> when property 'to' is passed", () => {
        const wrapper = shallow(<BinaryLink to='/' />);
        expect(wrapper.find(NavLink)).to.have.length(1);
    });
    it("should not render <Navlink /> when property 'to' is not passed", () => {
        const wrapper = shallow(<BinaryLink />);
        expect(wrapper.find(NavLink)).to.have.length(0);
    });
    it("should render <a /> when property 'to' is not passed", () => {
        const wrapper = shallow(<BinaryLink />);
        expect(wrapper.contains(<a />)).to.equal(true);
    });
    it("should not render <a> when property 'to' is passed", () => {
        const wrapper = shallow(<BinaryLink to={routes.trade} />);
        expect(wrapper.contains(<a />)).to.equal(false);
    });
    it('should render component with props if any given', () => {
        const wrapper = shallow(<BinaryLink className='a-cool-classname' />);
        expect(wrapper.find('.a-cool-classname').exists());
    });
    it('should throw error if the route given is not a valid route', () => {
        let error;
        try {
            shallow(<BinaryLink to='/wrongRoute' />);
        } catch (e) {
            error = e;
        }
        expect(error).to.be.instanceOf(Error);
    });
});
