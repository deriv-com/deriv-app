import React from 'react';
import { Router } from 'react-router';
import { createBrowserHistory } from 'history';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ErrorComponent from '../error-component';

describe('ErrorComponent', () => {
    const common_error_message = 'Sorry, an error occurred while processing your request.';
    const test_title = 'Test title';
    const test_message = 'Test message';
    const redirect_button = 'Confirm';
    const default_button = 'Ok';
    const refresh_button = 'Refresh';
    const browser_history = createBrowserHistory();
    const reloadFn = () => {
        window.location.reload();
    };

    beforeAll(() => {
        Object.defineProperty(window, 'location', {
            configurable: true,
            value: { reload: jest.fn() },
        });
    });

    it('should render ErrorComponent', () => {
        render(
            <Router history={browser_history}>
                <ErrorComponent header={test_title} />
            </Router>
        );

        expect(screen.getByText(test_title)).toBeInTheDocument();
    });
    it('should render child component Dialog if ErrorComponent receive is_dialog === true', () => {
        render(<ErrorComponent is_dialog />);

        expect(screen.getByText('There was an error')).toBeInTheDocument();
        expect(screen.getByText(default_button)).toBeInTheDocument();
        expect(screen.getByText(common_error_message)).toBeInTheDocument();
    });
    it('should render child component Dialog with received title, message and redirect label if ErrorComponent passed them and is_dialog === true', () => {
        render(
            <ErrorComponent is_dialog header={test_title} message={test_message} redirect_label={redirect_button} />
        );

        expect(screen.getByText(test_title)).toBeInTheDocument();
        expect(screen.getByText(redirect_button)).toBeInTheDocument();
        expect(screen.getByText(test_message)).toBeInTheDocument();
    });
    it('should render PageError component with received header, message and redirect label if ErrorComponent passed them and is_dialog === false', () => {
        render(
            <Router history={browser_history}>
                <ErrorComponent header={test_title} message={test_message} redirect_label={redirect_button} />
            </Router>
        );

        expect(screen.getByText(test_title)).toBeInTheDocument();
        expect(screen.getByText(test_message)).toBeInTheDocument();
        expect(screen.getByText(redirect_button)).toBeInTheDocument();
    });
    it('should render PageError without additional text if ErrorComponent receive should_show_refresh === false and is_dialog === false', () => {
        render(
            <Router history={browser_history}>
                <ErrorComponent should_show_refresh={false} />
            </Router>
        );

        expect(screen.queryByText('Please refresh this page to continue.')).not.toBeInTheDocument();
    });
    it('should call a function which was passed in props when user click on redirect button', () => {
        const redirectOnClick = jest.fn();

        render(<ErrorComponent is_dialog redirectOnClick={redirectOnClick} />);
        userEvent.click(screen.getByText(default_button));

        expect(redirectOnClick).toHaveBeenCalled();
    });
    it('should call a reload function when user click on redirect button for Dialog component', () => {
        render(<ErrorComponent is_dialog />);
        userEvent.click(screen.getByText(default_button));
        reloadFn();

        expect(window.location.reload).toHaveBeenCalled();
    });
    it('should call a reload function when user click on redirect button for PageError component', () => {
        render(
            <Router history={browser_history}>
                <ErrorComponent header={test_title} should_show_refresh={false} />
            </Router>
        );
        userEvent.click(screen.getByText(refresh_button));
        reloadFn();

        expect(window.location.reload).toHaveBeenCalled();
    });
});
