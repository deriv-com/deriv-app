import React from 'react';
import { Router } from 'react-router-dom';
import { createBrowserHistory } from 'history';
import { fireEvent, render, screen } from '@testing-library/react';
import { PlatformContext } from '@deriv/shared';
import { findRouteByPath } from '../helpers';
import BinaryLink from '../binary-link';

jest.mock('Stores/connect', () => ({
    __esModule: true,
    default: 'mockedDefaultExport',
    connect: () => Component => Component,
}));

jest.mock('../helpers', () => ({
    findRouteByPath: jest.fn(() => '/test/path'),
    normalizePath: jest.fn(() => '/test/path'),
}));

jest.mock('Constants/routes-config', () => () => ({
    getRoutesConfig: jest.fn(() => []),
}));

describe('<BinaryLink />', () => {
    const history = createBrowserHistory();

    it('should show and trigger Navlink with path and active className', () => {
        render(
            <PlatformContext.Provider value={{ is_appstore: false, is_deriv_crypto: false, is_pre_appstore: false }}>
                <Router history={history}>
                    <BinaryLink to='test-link'>Simple test link</BinaryLink>
                </Router>
            </PlatformContext.Provider>
        );

        expect(screen.getByText('Simple test link')).toBeInTheDocument();

        fireEvent.click(screen.getByRole('link'));
        expect(window.location.pathname).toBe('/test/path');
    });

    it('should show simple link text', () => {
        render(
            <PlatformContext.Provider value={{ is_appstore: false, is_deriv_crypto: false, is_pre_appstore: false }}>
                <Router history={history}>
                    <BinaryLink>Simple test link without Navlink</BinaryLink>
                </Router>
            </PlatformContext.Provider>
        );

        expect(screen.getByText('Simple test link without Navlink')).toBeInTheDocument();
    });
    it('should thorw error if the path is not found', () => {
        findRouteByPath.mockReturnValue('');

        expect(() =>
            render(
                <PlatformContext.Provider
                    value={{ is_appstore: false, is_deriv_crypto: false, is_pre_appstore: false }}
                >
                    <Router history={history}>
                        <BinaryLink to='test-link'>Simple test link</BinaryLink>
                    </Router>
                </PlatformContext.Provider>
            )
        ).toThrowError(/route not found: test-link/i);
    });
});
