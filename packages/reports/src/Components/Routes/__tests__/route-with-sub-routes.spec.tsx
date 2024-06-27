import React from 'react';
import { Redirect } from 'react-router-dom';
import { render, screen } from '@testing-library/react';
import RouteWithSubRoutes from '../route-with-sub-routes';

type TRenderProps = {
    location: {
        pathname: string;
    };
};
type TMockFunction = {
    path: string;
    exact?: boolean;
    render?: (props: TRenderProps) => React.ReactNode;
};

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    Route: jest.fn(({ path, exact, render }: TMockFunction) => (
        <div>
            <span>{`path param: ${path}`}</span>
            <span>{`exact param: ${exact}`}</span>
            {render?.({ location: { pathname: path } })}
        </div>
    )),
    Redirect: jest.fn(({ to }) => <div>{`Redirect to: ${to}`}</div>),
}));

const mockRedirectToLogin = jest.fn();

jest.mock('@deriv/shared', () => ({
    redirectToLogin: jest.fn(),
    isEmptyObject: (obj: Record<string, any>) => Object.keys(obj).length === 0,
    routes: { index: '/index', is_logged_in: '/login' },
    removeBranchName: jest.fn(pathname => pathname.replace('/index', '')),
    default_title: 'Default Title',
}));

jest.mock('@deriv/translations', () => ({
    getLanguage: jest.fn().mockReturnValue('EN'),
}));

beforeEach(() => jest.clearAllMocks());

const route = {
    getTitle: jest.fn(),
    component: Redirect,
    is_logging_in: true,
    is_logged_in: true,
    exact: true,
    path: '/test-path',
};

const MockRouteWithSubRoutes = () => <RouteWithSubRoutes {...route} />;

describe('<RouteWithSubRoutes />', () => {
    it('should render the "RouteWithSubRoutes" component', () => {
        render(<MockRouteWithSubRoutes />);
        const span_element = screen.getByText(/path param: \/test-path/i);
        expect(span_element).toBeInTheDocument();
    });
    it('should render properties', () => {
        render(<MockRouteWithSubRoutes />);
        const path_param = screen.getByText(/\/test-path/i);
        const exact_param = screen.getByText(/exact param: true/i);
        expect(path_param).toBeInTheDocument();
        expect(exact_param).toBeInTheDocument();
    });
    it('should redirect to the specified path', () => {
        render(<MockRouteWithSubRoutes />);
        const redirect_element = screen.getByText(/Redirect to:/i);
        expect(redirect_element).toBeInTheDocument();
    });
    it('should call redirectToLogin when not logged in and not logging in', () => {
        const new_route = {
            ...route,
            is_logging_in: false,
            is_logged_in: false,
            is_authenticated: true,
        };
        render(<RouteWithSubRoutes {...new_route} />);
        expect(screen.getByText(/Redirect to:/i)).toBeInTheDocument();
    });
    it('should set document title to default title when getTitle is not defined', () => {
        render(<MockRouteWithSubRoutes />);
        expect(document.title).toBe('| Default Title');
    });
    it('should set document title based on route.getTitle', () => {
        const title = 'Test Title';
        route.getTitle.mockReturnValue(title);
        render(<MockRouteWithSubRoutes />);
        expect(document.title).toBe(`Test Title | Default Title`);
    });
    it('should redirect to default subroute if pathname matches route path', () => {
        const default_subroute = {
            path: '/default-subroute',
            default: true,
            component: jest.fn(),
            getTitle: jest.fn(),
        };
        const new_route = {
            ...route,
            routes: [default_subroute],
            is_logging_in: false,
            is_logged_in: true,
            component: () => <div>Component</div>,
        };

        Object.defineProperty(window, 'location', {
            writable: true,
            value: { pathname: '/test-path' },
        });

        render(<RouteWithSubRoutes {...new_route} />);
        const redirect_element = screen.getByText(/Redirect to: \/default-subroute/i);
        expect(redirect_element).toBeInTheDocument();
    });
    it('should render the route component if not redirecting or logging in', () => {
        const TestComponent = () => <div>Test Component</div>;
        const new_route = {
            ...route,
            is_logging_in: false,
            is_logged_in: true,
            component: TestComponent,
        };
        render(<RouteWithSubRoutes {...new_route} />);
        const component_element = screen.getByText(/Test Component/i);
        expect(component_element).toBeInTheDocument();
    });
});
