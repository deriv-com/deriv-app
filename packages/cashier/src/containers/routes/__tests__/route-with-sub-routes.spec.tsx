// TODO refactor old tests in this component
import React from 'react';
import { RouteWithSubRoutesRender } from '../route-with-sub-routes';
import { MemoryRouter, Redirect } from 'react-router-dom';
import { render } from '@testing-library/react';

const mockFunction = jest.fn();
const route = {
    getTitle: mockFunction,
    component: Redirect,
    is_logging_in: true,
    is_logged_in: true,
    exact: true,
    path: '/',
    to: '/root',
};

const MockComponent = () => (
    <MemoryRouter>
        <RouteWithSubRoutesRender {...route} />
    </MemoryRouter>
);

describe('<RouteWithSubRoutes />', () => {
    it('should render one <RouteWithSubRoutesRender /> component', () => {
        render(<MockComponent />);
    });
});

// import React from 'react';
// import { RouteWithSubRoutesRender } from '../route-with-sub-routes';
// import { Redirect } from 'react-router-dom';

// configure({ adapter: new Adapter() });

// describe('<RouteWithSubRoutes />', () => {
//     it('should render one <RouteWithSubRoutesRender /> component', () => {
//         const wrapper = shallow(<RouteWithSubRoutesRender />);
//         expect(wrapper).toHaveLength(1);
//     });
//     it('should have props as passed as route', () => {
//         const route = { path: '/', component: Redirect, title: '', exact: true, to: '/root' };
//         const wrapper = shallow(<RouteWithSubRoutesRender {...route} />);
//         expect(wrapper.prop('exact')).toBe(true);
//         expect(wrapper.prop('path')).toBe('/');
//         expect(wrapper.prop('render')).toBeInstanceOf(Function);
//     });
// });
