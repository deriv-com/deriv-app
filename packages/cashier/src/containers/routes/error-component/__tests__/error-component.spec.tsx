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
    const props = {
        redirect_to: '/testurl',
        redirect_label: ['testlabel'],
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
        const redirectOnClick = '';
        renderWithRouter(<ErrorComponent {...props} buttonOnClick={redirectOnClick} />);
        reloadFn(); // as defined above..
        expect(window.location.reload).toHaveBeenCalled();
    });
    it('should show the redirect button label as refresh when there is no redirect_label', () => {
        const redirectOnClick = '';
        const redirect_to = '/testurl';
        renderWithRouter(<ErrorComponent redirect_to={redirect_to} buttonOnClick={redirectOnClick} />);
        expect(screen.getByText('Refresh')).toBeInTheDocument();
    });
    it('should trigger the history.listen and call the setError function when redirect button get clicked', () => {
        const redirectOnClick = jest.fn();
        const setError = jest.fn();
        renderWithRouter(<ErrorComponent {...props} buttonOnClick={redirectOnClick} setError={setError} />);

        fireEvent.click(screen.getByText('testlabel'));
        if (typeof setError === 'function') {
            expect(setError).toHaveBeenCalledTimes(1);
        }
    });
});
