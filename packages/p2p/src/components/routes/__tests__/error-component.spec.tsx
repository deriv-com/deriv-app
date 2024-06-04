import React from 'react';
import { screen, render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createBrowserHistory } from 'history';
import { Router } from 'react-router-dom';
import ErrorComponent from '../error-component';

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

    const mock_props = {
        header: 'Error header',
        message: 'Error message',
        redirect_to: '/test_url',
        redirect_label: 'test_label',
        should_clear_error_on_click: true,
        should_show_refresh: true,
        redirectOnClick: jest.fn(),
        setError: jest.fn(),
    };

    it('should show the error message when header and message is passed', () => {
        renderWithRouter(<ErrorComponent {...mock_props} />);
        expect(screen.getByText(mock_props.message)).toBeInTheDocument();
    });

    it('should show refresh message when should_show_refresh is true', () => {
        renderWithRouter(<ErrorComponent {...mock_props} should_show_refresh />);
        expect(screen.getByText('Please refresh this page to continue.')).toBeInTheDocument();
    });

    it('should not show refresh message when should_show_refresh is false', () => {
        const refreshRequestText = screen.queryByText('Please refresh this page to continue.');
        renderWithRouter(<ErrorComponent {...mock_props} should_show_refresh={false} />);
        expect(refreshRequestText).not.toBeInTheDocument();
    });

    it('should show header message when header message is passed', () => {
        renderWithRouter(<ErrorComponent {...mock_props} />);
        expect(screen.getByText(mock_props.header)).toBeInTheDocument();
    });

    it('should refresh the page when redirectOnClick is not passed', () => {
        const redirectOnClick = null;
        renderWithRouter(<ErrorComponent {...mock_props} redirectOnClick={redirectOnClick} />);
        reloadFn();
    });

    it('should refresh the page when redirectOnClick is not passed or empty', () => {
        const redirectOnClick = jest.fn();
        renderWithRouter(<ErrorComponent {...mock_props} redirectOnClick={redirectOnClick} />);
        reloadFn();
        expect(window.location.reload).toHaveBeenCalled();
    });

    it('should show the redirect button label as refresh when there is no redirect_label', () => {
        const redirectOnClick = null;
        const redirect_to = '/test_url';
        renderWithRouter(
            <ErrorComponent
                {...mock_props}
                redirect_label={''}
                redirect_to={redirect_to}
                redirectOnClick={redirectOnClick}
                should_show_refresh
            />
        );
        reloadFn();
        expect(screen.getByText('Refresh')).toBeInTheDocument();
    });

    it('should trigger the history.listen and call the setError function when redirect button get clicked', () => {
        const redirectOnClick = jest.fn();
        const setError = jest.fn();
        renderWithRouter(
            <ErrorComponent
                {...mock_props}
                should_show_refresh={false}
                redirectOnClick={redirectOnClick}
                setError={setError}
            />
        );

        userEvent.click(screen.getByText('test_label'));
        expect(setError).toHaveBeenCalled();
    });

    it('should call location.reload when redirectOnClick is not passed should_clear_error_on_click is false and button is pressed', () => {
        const redirectOnClick = null;
        renderWithRouter(
            <ErrorComponent {...mock_props} redirectOnClick={redirectOnClick} should_clear_error_on_click={false} />
        );
        userEvent.click(screen.getByText('test_label'));

        expect(window.location.reload).toHaveBeenCalled();
    });
});
