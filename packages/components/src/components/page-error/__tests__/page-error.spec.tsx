import React from 'react';
import { Router } from 'react-router-dom';
import { screen, render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createBrowserHistory } from 'history';
import PageError from '../index';

describe('<PageError/>', () => {
    let history;
    const renderWithRouter = (component: React.ReactElement) => {
        history = createBrowserHistory();
        return render(<Router history={history}>{component}</Router>);
    };

    const props = {
        header: 'test header message',
        messages: ['test message'],
        redirect_labels: ['test_label'],
        redirect_urls: ['/test'],
        should_clear_error_on_click: true,
        buttonOnClick: jest.fn(),
        setError: jest.fn(),
        should_redirect: true,
    };

    it('should call buttonOnClick() upon button click when should_redirect and should_clear_error_on_click equal to false', () => {
        const buttonOnClick = jest.fn();
        render(
            <PageError
                {...props}
                should_clear_error_on_click={false}
                buttonOnClick={buttonOnClick}
                should_redirect={false}
            />
        );
        expect(screen.getByRole('button')).toHaveClass('dc-page-error__btn--no-redirect');
        userEvent.click(screen.getByRole('button'));
        expect(buttonOnClick).toHaveBeenCalledTimes(1);
    });
    it('should call setError() when redirect button get clicked', () => {
        const setError = jest.fn();
        renderWithRouter(<PageError {...props} should_redirect={true} setError={setError} />);
        const link = screen.getByRole('link');
        userEvent.click(link);
        expect(setError).toHaveBeenCalledTimes(1);
    });
});
