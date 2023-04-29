import React from 'react';
import { Router } from 'react-router';
import { createBrowserHistory } from 'history';
import { render } from '@testing-library/react';
import Page404 from '../Page404';

describe('Page404', () => {
    const browser_history = createBrowserHistory();

    it('should render Page404', () => {
        const { container } = render(
            <Router history={browser_history}>
                <Page404 />
            </Router>
        );

        expect(container).toBeInTheDocument();
    });
});
