import React from 'react';
import { Router } from 'react-router-dom';
import { createBrowserHistory } from 'history';
import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { PlatformContext } from '@deriv/shared';
import BinaryRoutes from '../binary-routes';

jest.mock('Stores/connect', () => ({
    __esModule: true,
    default: 'mockedDefaultExport',
    connect: () => Component => Component,
}));

jest.mock('../route-with-sub-routes.jsx', () => jest.fn(() => 'RouteWithSubRoutes'));

jest.mock('Constants/routes-config.js', () => () => ({
    getRoutesConfig: jest.fn().mockReturnValue([]),
}));

describe('<BinaryRoutes />', () => {
    const history = createBrowserHistory();

    it('should show ', async () => {
        act(() => {
            render(
                <PlatformContext.Provider value={{ is_appstore: false }}>
                    <Router history={history}>
                        <BinaryRoutes is_social_signup={false} />
                    </Router>
                </PlatformContext.Provider>
            );
        });

        await waitFor(() => {
            screen.debug();
        });
    });
});
