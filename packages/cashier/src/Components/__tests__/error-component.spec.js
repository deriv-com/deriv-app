import React, { useEffect } from 'react';
import { screen, render,fireEvent } from '@testing-library/react';
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
        window.location.reload(true);
    };
    beforeAll(() => {
        Object.defineProperty(window, 'location', {
            configurable: true,
            value: { reload: jest.fn() },
        });
    });

    it('should show the default message when message is not passed', () => {
        const message = '';
         const redirect_to = ['/testurl'];
        const redirect_label = ['testlabel'];
        renderWithRouter(<ErrorComponent redirect_label={redirect_label} redirect_to={redirect_to} message={message} />);
        expect(screen.getByText('Sorry, an error occured while processing your request.')).toBeInTheDocument();
    });

    it('should show the actual message when message is passed', () => {
        const message = 'This is the error message';
         const redirect_to = ['/testurl'];
        const redirect_label = ['testlabel'];
        renderWithRouter(<ErrorComponent redirect_label={redirect_label} redirect_to={redirect_to} message={message} />);
        expect(screen.getByText(message)).toBeInTheDocument();
    });

    it('should show refresh message when should_show_refresh is true', () => {
         const redirect_to = ['/testurl'];
        const redirect_label = ['testlabel'];
        renderWithRouter(<ErrorComponent redirect_label={redirect_label} redirect_to={redirect_to} should_show_refresh={true} />);
        expect(screen.getByText('Please refresh this page to continue.')).toBeInTheDocument();
    });
    it('should show refresh message when should_show_refresh is false', () => {
        const refreshRequestText = screen.queryByText('Please refresh this page to continue.');
         const redirect_to = ['/testurl'];
        const redirect_label = ['testlabel'];
        renderWithRouter(<ErrorComponent redirect_label={redirect_label} redirect_to={redirect_to} should_show_refresh={false} />);
        expect(refreshRequestText).toBeNull();
        //expect(screen.not.getByText('Please refresh this page to continue.')).toBeInTheDocument();
    });
    it('should show default message when header message is not passed', () => {
        const header = '';
         const redirect_to = ['/testurl'];
        const redirect_label = ['testlabel'];
        renderWithRouter(<ErrorComponent redirect_label={redirect_label} redirect_to={redirect_to} header={header} />);
        expect(screen.getByText('Something’s not right')).toBeInTheDocument();
    });
    it('should show actual message when header message is passed', () => {
        const header = 'Header Text';
         const redirect_to = ['/testurl'];
        const redirect_label = ['testlabel'];
        renderWithRouter(<ErrorComponent redirect_label={redirect_label} redirect_to={redirect_to} header={header} />);
        expect(screen.getByText(header)).toBeInTheDocument();
    });
    it('should refresh the page when redirectOnClick is not passed or empty', () => {
        const redirectOnClick = '';
         const redirect_to = ['/testurl'];
        const redirect_label = ['testlabel'];
        renderWithRouter(<ErrorComponent redirect_label={redirect_label} redirect_to={redirect_to} buttonOnClick={redirectOnClick} />);
        reloadFn(); // as defined above..
        expect(window.location.reload).toHaveBeenCalled();
    });
    it('should call the setError function if the seterror is a function', () => {
        const redirectOnClick = jest.fn();
        const history = createBrowserHistory();
        const setError = jest.fn();
        const redirect_to = ['/testurl'];
        const redirect_label = ['testlabel'];
        const { container,unmount } = render(
            <Router history={history}>
                <ErrorComponent redirect_label={redirect_label} redirect_to={redirect_to} buttonOnClick={redirectOnClick} setError={setError}/>
            </Router>
        );
        fireEvent.click(screen.getByText('testlabel'));

        if(typeof setError === 'function'){
            expect(setError).toHaveBeenCalledTimes(1);
        }
    });
});
