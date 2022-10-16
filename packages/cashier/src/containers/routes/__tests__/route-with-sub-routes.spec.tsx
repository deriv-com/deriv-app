import React from 'react';
import { expect } from 'chai';
import { configure, shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { RouteWithSubRoutesRender } from '../route-with-sub-routes';
import { Redirect } from 'react-router-dom';

configure({ adapter: new Adapter() });

describe('<RouteWithSubRoutes />', () => {
    it('should render one <RouteWithSubRoutesRender /> component', () => {
        const wrapper = shallow(<RouteWithSubRoutesRender />);
        expect(wrapper).to.have.length(1);
    });
    it('should have props as passed as route', () => {
        const route = { path: '/', component: Redirect, title: '', exact: true, to: '/root' };
        const wrapper = shallow(<RouteWithSubRoutesRender {...route} />);
        expect(wrapper.prop('exact')).to.equal(true);
        expect(wrapper.prop('path')).to.equal('/');
        expect(wrapper.prop('render')).to.be.an.instanceof(Function);
    });
});
