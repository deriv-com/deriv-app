import React from 'react';
import { Redirect } from 'react-router-dom';
import { render, screen } from '@testing-library/react';
import RouteWithSubRoutes from '../route-with-sub-routes';

type TMockFunction = {
    path: string;
    exact?: boolean;
};

jest.mock('Stores/connect', () => ({
    __esModule: true,
    default: 'mockedDefaultExport',
    connect:
        () =>
        <T,>(Component: T) =>
            Component,
}));

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
};

const MockRouteWithSubRoutesRender = () => <RouteWithSubRoutes {...route} />;

describe('RouteWithSubRoutes component', () => {
    it('should render the "RouteWithSubRoutes" component', () => {
        render(<MockRouteWithSubRoutesRender />);
        const span_element = screen.getByText(/path param: \/test-path/i);
        expect(span_element).toBeInTheDocument();
    });

    it('should render properties', () => {
        render(<MockRouteWithSubRoutesRender />);
        const path_param = screen.getByText(/\/test-path/i);
        const exact_param = screen.getByText(/exact param: true/i);
        expect(path_param).toBeInTheDocument();
        expect(exact_param).toBeInTheDocument();
    });
});
