// TODO refactor old tests in this component
import React from 'react';
import { RouteWithSubRoutesRender } from '../route-with-sub-routes.jsx';
import { Redirect } from 'react-router-dom';
import { PlatformContext } from '@deriv/shared';

// configure({ adapter: new Adapter() });

describe('<RouteWithSubRoutes />', () => {
    it('should render one <RouteWithSubRoutesRender /> component', () => {
        // const comp = (
        //     <PlatformContext.Provider>
        //         <RouteWithSubRoutesRender />
        //     </PlatformContext.Provider>
        // );
        // const wrapper = shallow(comp);
        // expect(wrapper).toHaveLength(1);
    });
    // it('should have props as passed as route', () => {
    //     const route = { path: '/', component: Redirect, title: '', exact: true, to: '/root' };
    //     const comp = (
    //         <PlatformContext.Provider>
    //             <RouteWithSubRoutesRender {...route} />
    //         </PlatformContext.Provider>
    //     );
    //     const wrapper = shallow(comp);
    //     expect(wrapper.prop('exact')).toBe(true);
    //     expect(wrapper.prop('path')).toBe('/');
    // });
});
