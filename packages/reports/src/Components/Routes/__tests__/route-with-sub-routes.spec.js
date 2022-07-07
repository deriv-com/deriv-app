import React from 'react';
import { expect } from 'chai';
import { configure, shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { RouteWithSubRoutesRender } from '../route-with-sub-routes.jsx';
import { Redirect } from 'react-router-dom';
import { PlatformContext } from '@deriv/shared';

configure({ adapter: new Adapter() });

describe('<RouteWithSubRoutes />', () => {
    it('should render one <RouteWithSubRoutesRender /> component', () => {
        const comp = (
            <PlatformContext.Provider>
                <RouteWithSubRoutesRender />
            </PlatformContext.Provider>
        );
        const wrapper = shallow(comp);
        expect(wrapper).to.have.length(1);
    });
    it('should have props as passed as route', () => {
        const route = { path: '/', component: Redirect, title: '', exact: true, to: '/root' };
        const comp = (
            <PlatformContext.Provider>
                <RouteWithSubRoutesRender {...route} />
            </PlatformContext.Provider>
        );
        const wrapper = shallow(comp);
        expect(wrapper.prop('exact')).to.equal(true);
        expect(wrapper.prop('path')).to.equal('/');
    });
});
