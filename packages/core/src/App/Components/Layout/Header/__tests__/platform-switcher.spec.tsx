import React from 'react';
import ReactDOM from 'react-dom';
import { RouteComponentProps, Router } from 'react-router-dom';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import PlatformSwitcher from '../platform-switcher';
import { createBrowserHistory } from 'history';

jest.mock('Stores/connect.js', () => ({
    __esModule: true,
    default: 'mockedDefaultExport',
    connect:
        () =>
        <T,>(Component: T) =>
            Component,
}));

jest.mock('@deriv/shared', () => ({
    ...jest.requireActual('@deriv/shared'),
    isMobile: jest.fn(() => true),
}));

const withRouter = <T extends object>(Component: React.ComponentType<T>) => {
    const history = createBrowserHistory();
    const WrapperComponent = <U extends object>(props: T & U) => (
        <Router history={history}>
            <Component {...props} />
        </Router>
    );

    return WrapperComponent;
};

const PlatformSwitcherComponent = withRouter(PlatformSwitcher);

describe('PlatformSwitcher component', () => {
    beforeAll(() => {
        ReactDOM.createPortal = jest.fn(component => {
            return component as React.ReactPortal;
        });
    });
    afterAll(() => {
        (ReactDOM.createPortal as jest.Mock).mockClear();
    });

    it('should render <PlatformSwitcherLoader /> component if "app_routing_history" is an empty array', () => {
        render(<PlatformSwitcherComponent app_routing_history={[{ pathname: '' }]} is_logged_in />);
        const div_element = screen.getByTestId('dt_platform_switcher_preloader');
        expect(div_element).toBeInTheDocument();
    });

    it('should have "platform-switcher__preloader--is-mobile" class if "app_routing_history" is an empty array and "isMobile" is "true"', () => {
        render(<PlatformSwitcherComponent app_routing_history={[{ pathname: '' }]} is_logged_in />);
        const div_element = screen.getByTestId('dt_platform_switcher_preloader');
        expect(div_element).toHaveClass('platform-switcher__preloader--is-mobile');
    });

    it('should render "platform-switcher" if "app_routing_history" is not an empty array', () => {
        render(<PlatformSwitcherComponent app_routing_history={[{ pathname: 'test' }]} />);
        const div_element = screen.getByTestId('dt_platform_switcher');
        expect(div_element).toBeInTheDocument();
    });

    it('should not have "platform-switcher--active" class if "app_routing_history" is not an empty array and "is_open" is "false"', () => {
        render(<PlatformSwitcherComponent app_routing_history={[{ pathname: 'test' }]} />);
        const div_element = screen.getByTestId('dt_platform_switcher');
        expect(div_element).not.toHaveClass('platform-switcher--active');
    });

    it('should have "platform-switcher--is-mobile" class if "app_routing_history" is not an empty array and "isMobile" is "true"', () => {
        render(<PlatformSwitcherComponent app_routing_history={[{ pathname: 'test' }]} />);
        const div_element = screen.getByTestId('dt_platform_switcher');
        expect(div_element).toHaveClass('platform-switcher--is-mobile');
    });

    it('should call setIsOpen with false upon closing platform switcher if setIsOpen prop is passed', () => {
        const props = {
            app_routing_history: [{ pathname: 'test' }],
            is_open: true,
            setIsOpen: jest.fn(),
        };
        render(<PlatformSwitcherComponent {...props} />);
        const div_element = screen.getByTestId('dt_platform_switcher');
        userEvent.click(div_element);
        expect(props.setIsOpen).toHaveBeenCalledWith(false);
    });
});
