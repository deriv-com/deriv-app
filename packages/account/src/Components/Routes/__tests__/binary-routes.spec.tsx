import React from 'react';
import { Router } from 'react-router-dom';
import { createBrowserHistory } from 'history';

import { PlatformContext } from '@deriv/shared';
import { mockStore, StoreProvider } from '@deriv/stores';
import { render, screen } from '@testing-library/react';

import BinaryRoutes from '../binary-routes';

jest.mock('../route-with-sub-routes', () => jest.fn(() => <div>RouteWithSubRoutes</div>));

jest.mock('Constants/routes-config', () => () => [{}]);

describe('<BinaryRoutes />', () => {
    const history = createBrowserHistory();

    it('should render BinaryRoutes with mocked route component', () => {
        const mock = mockStore({
            modules: {
                common: {
                    current_language: 'EN',
                },
            },
        });
        const wrapper = ({ children }: { children: JSX.Element }) => (
            <StoreProvider store={mock}>{children}</StoreProvider>
        );
        render(
            <PlatformContext.Provider value={{ is_appstore: false, is_deriv_crypto: false, is_pre_appstore: false }}>
                <Router history={history}>
                    <BinaryRoutes is_logged_in is_logging_in={false} />
                </Router>
            </PlatformContext.Provider>,
            { wrapper }
        );

        expect(screen.getByText('RouteWithSubRoutes')).toBeInTheDocument();
    });
});
