import React from 'react';
import { Router } from 'react-router-dom';
import { createBrowserHistory } from 'history';
import { render, screen } from '@testing-library/react';
import { mockStore, StoreProvider } from '@deriv/stores';
import BinaryRoutes from '../binary-routes';

jest.mock('@deriv/translations', () => ({
    Localize: jest.fn(({ i18n_default_text }) => <div>{i18n_default_text}</div>),
    localize: jest.fn(text => text),
}));

jest.mock('../route-with-sub-routes', () => jest.fn(() => <div>RouteWithSubRoutes</div>));

jest.mock('Constants/routes-config', () => () => [{}]);

describe('<BinaryRoutes />', () => {
    const history = createBrowserHistory();

    it('should render BinaryRoutes with mocked route component', () => {
        const mock = mockStore({});
        const wrapper = ({ children }: { children: JSX.Element }) => (
            <StoreProvider store={mock}>{children}</StoreProvider>
        );
        render(
            <Router history={history}>
                <BinaryRoutes is_logged_in={true} is_logging_in={false} />
            </Router>,
            { wrapper }
        );
        expect(screen.getByText('RouteWithSubRoutes')).toBeInTheDocument();
    });
});
