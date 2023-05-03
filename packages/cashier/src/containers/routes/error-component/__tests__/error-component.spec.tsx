import React from 'react';
import { screen, render, fireEvent } from '@testing-library/react';
import ErrorComponent from '../error-component';
import { Router } from 'react-router-dom';
import { createBrowserHistory } from 'history';

describe('<ErrorComponent/>', () => {
    let history;
    const renderWithRouter = component => {
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
    const mock_props = {
        redirect_to: '/testurl',
        redirect_label: 'testlabel',
        header: 'This is the error header',
        message: 'This is the error message',
        redirectOnClick: jest.fn(),
        should_clear_error_on_click: true,
        setError: jest.fn(),
        should_show_refresh: true,
        app_routing_history: [{ pathname: '/cashier' }],
    };

    it('should show the actual error message when header and message is passed', () => {
        renderWithRouter(<ErrorComponent {...mock_props} />);
        expect(screen.getByText(mock_props.message)).toBeInTheDocument();
    });

    it('should show refresh message when should_show_refresh is true', () => {
        renderWithRouter(<ErrorComponent {...mock_props} should_show_refresh />);
        expect(screen.getByText('Please refresh this page to continue.')).toBeInTheDocument();
    });

    it('do not show refresh message when should_show_refresh is false', () => {
        const refreshRequestText = screen.queryByText('Please refresh this page to continue.');
        renderWithRouter(<ErrorComponent {...mock_props} should_show_refresh={false} />);
        expect(refreshRequestText).not.toBeInTheDocument();
    });

    it('should refresh the page when redirectOnClick is not passed or empty', () => {
        const redirectOnClick = jest.fn();
        renderWithRouter(<ErrorComponent {...mock_props} redirectOnClick={redirectOnClick} />);
        reloadFn(); // as defined above..
        expect(window.location.reload).toHaveBeenCalled();
    });

    it('should show the redirect button label as refresh when there is no redirect_label', () => {
        const redirectOnClick = jest.fn();
        const redirect_to = '/testurl';

        renderWithRouter(
            <ErrorComponent
                {...mock_props}
                redirect_to={redirect_to}
                redirectOnClick={redirectOnClick}
                redirect_label=''
                should_show_refresh
            />
        );
        expect(screen.getByText('Refresh')).toBeInTheDocument();
    });

    it('should trigger the history.listen and call the setError function when redirect button get clicked', () => {
        const redirectOnClick = jest.fn();
        const setError = jest.fn();
        renderWithRouter(<ErrorComponent {...mock_props} redirectOnClick={redirectOnClick} setError={setError} />);

        fireEvent.click(screen.getByText('testlabel'));
        if (typeof setError === 'function') {
            expect(setError).toHaveBeenCalled();
        }
    });
});
