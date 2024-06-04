import React from 'react';
import { Router } from 'react-router-dom';
import { createBrowserHistory } from 'history';
import { fireEvent, render, screen } from '@testing-library/react';
import { findRouteByPath } from '../helpers';
import BinaryLink from '../binary-link';

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
            <Router history={history}>
                <BinaryLink to='test-link'>Simple test link</BinaryLink>
            </Router>
        );

        expect(screen.getByText('Simple test link')).toBeInTheDocument();

        fireEvent.click(screen.getByRole('link'));
        expect(window.location.pathname).toBe('/test/path');
    });

    it('should show simple link text', () => {
        render(
            <Router history={history}>
                <BinaryLink>Simple test link without Navlink</BinaryLink>
            </Router>
        );

        expect(screen.getByText('Simple test link without Navlink')).toBeInTheDocument();
    });
    it('should thorw error if the path is not found', () => {
        (findRouteByPath as jest.Mock).mockReturnValue('');
        const renderBinaryLink = () =>
            render(
                <Router history={history}>
                    <BinaryLink to='test-link'>Simple test link</BinaryLink>
                </Router>
            );
        expect(renderBinaryLink).toThrowError(/route not found: test-link/i);
    });
});
