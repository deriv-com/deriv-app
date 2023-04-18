import React from 'react';
import { screen, render, fireEvent } from '@testing-library/react';
import ErrorComponent from '../error-component';
import { Router } from 'react-router-dom';
import { createBrowserHistory } from 'history';

describe('<ErrorComponent/>', () => {
    let history;
    const renderWithRouter = (component: React.ReactElement) => {
        history = createBrowserHistory();
        return render(<Router history={history}>{component}</Router>);
    };
    const reloadFn = () => {
        window.location.reload();
    };
    beforeAll(() => {
        Object.defineProperty(window, 'location', {
            configurable: true,
            value: { reload: jest.fn() },
        });
    });

    const props = {
        header: 'test header message',
        message: 'test message',
        redirect_to: '/testurl',
        redirect_label: 'test_label',
        should_clear_error_on_click: true,
        should_show_refresh: true,
        app_routing_history: ['/test'],
        redirectOnClick: jest.fn() || null,
        setError: jest.fn(),
    };

    it('should show the default message when message is not passed', () => {
        const message = '';
        renderWithRouter(<ErrorComponent {...props} message={message} />);
        expect(screen.getByText('Sorry, an error occurred while processing your request.')).toBeInTheDocument();
    });

    it('should show the actual message when message is passed', () => {
        const message = 'This is the error message';
        renderWithRouter(<ErrorComponent {...props} message={message} />);
        expect(screen.getByText(message)).toBeInTheDocument();
    });

    it('should show refresh message when should_show_refresh is true', () => {
        renderWithRouter(<ErrorComponent {...props} should_show_refresh={true} />);
        expect(screen.getByText('Please refresh this page to continue.')).toBeInTheDocument();
    });

    it('do not show refresh message when should_show_refresh is false', () => {
        const refreshRequestText = screen.queryByText('Please refresh this page to continue.');
        renderWithRouter(<ErrorComponent {...props} should_show_refresh={false} />);
        expect(refreshRequestText).not.toBeInTheDocument();
    });

    it('should show default message when header message is not passed', () => {
        const header = '';
        renderWithRouter(<ErrorComponent {...props} header={header} />);
        expect(screen.getByText('Something’s not right')).toBeInTheDocument();
    });

    it('should show actual message when header message is passed', () => {
        const header = 'Header Text';
        renderWithRouter(<ErrorComponent {...props} header={header} />);
        expect(screen.getByText(header)).toBeInTheDocument();
    });

    it('should refresh the page when redirectOnClick is not passed or empty', () => {
        const redirectOnClick = null;
        renderWithRouter(<ErrorComponent {...props} redirectOnClick={redirectOnClick} />);
        reloadFn(); // as defined above..
        expect(window.location.reload).toHaveBeenCalled();
    });

    it('should show the redirect button label as refresh when there is no redirect_label', () => {
        const redirectOnClick = null;
        const redirect_to = '/testurl';
        renderWithRouter(
            <ErrorComponent
                {...props}
                redirect_label={''}
                redirect_to={redirect_to}
                redirectOnClick={redirectOnClick}
            />
        );
        expect(screen.getByText('Refresh')).toBeInTheDocument();
    });

    it('should trigger the history.listen and call the setError function when redirect button get clicked', () => {
        const redirectOnClick = jest.fn();
        const setError = jest.fn();
        renderWithRouter(
            <ErrorComponent
                {...props}
                should_show_refresh={false}
                redirectOnClick={redirectOnClick}
                setError={setError}
            />
        );

        fireEvent.click(screen.getByText('test_label'));
        expect(setError).toHaveBeenCalled();
    });
});
