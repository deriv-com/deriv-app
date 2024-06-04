import React from 'react';
import { Redirect } from 'react-router-dom';
import { render, screen } from '@testing-library/react';
import RouteWithSubRoutes from '../route-with-sub-routes';

type TMockFunction = {
    path: string;
    exact?: boolean;
};

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    Route: jest.fn(({ path, exact }: TMockFunction) => (
        <div>
            <span>{`path param: ${path}`}</span>
            <span>{`exact param: ${exact}`}</span>
        </div>
    )),
}));

afterEach(() => jest.clearAllMocks());

const route = {
    getTitle: jest.fn(),
    component: Redirect,
    is_logging_in: true,
    is_logged_in: true,
    exact: true,
    path: '/test-path',
    icon_component: '',
};

const MockRouteWithSubRoutes = () => <RouteWithSubRoutes {...route} />;

describe('RouteWithSubRoutes component', () => {
    it('should render RouteWithSubRoutes properties', () => {
        render(<MockRouteWithSubRoutes />);
        const path_param = screen.getByText(/\/test-path/i);
        const exact_param = screen.getByText(/exact param: true/i);
        expect(path_param).toBeInTheDocument();
        expect(exact_param).toBeInTheDocument();
    });
});
