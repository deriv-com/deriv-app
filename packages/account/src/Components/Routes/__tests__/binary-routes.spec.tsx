import React from 'react';
import { Router } from 'react-router-dom';
import { createBrowserHistory } from 'history';
import { render, screen } from '@testing-library/react';
import { PlatformContext } from '@deriv/shared';
import { StoreProvider, mockStore } from '@deriv/stores';
import BinaryRoutes from '../binary-routes';

jest.mock('../route-with-sub-routes', () => jest.fn(() => <div>RouteWithSubRoutes</div>));

jest.mock('Constants/routes-config', () => () => [{}]);

describe('<BinaryRoutes />', () => {
    const history = createBrowserHistory();

    it('should render BinaryRoutes with mocked route component', () => {
        const mock = mockStore({
            modules: {
                cfd: {
                    current_list: {
                        CR1231123: {
                            landing_company_short: 'maltainvest',
                        },
                    },
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
