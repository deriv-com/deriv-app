import React from 'react';
import * as Helpers from '../helpers';
import { routes } from '@deriv/shared';
import getRoutesConfig from 'Constants/routes-config';

describe('Helpers', () => {
    describe('findRouteByPath', () => {
        it('should return undefined when path is not in routes_config', () => {
            expect(Helpers.findRouteByPath('invalidRoute', getRoutesConfig())).toBeUndefined();
        });
        it('should return route_info when path is in routes_config and is not nested', () => {
            const result = Helpers.findRouteByPath(routes.reports, getRoutesConfig());
            expect(result.path).toBe(routes.reports);
        });
        it('should return route_info of parent route when path is in routes_config child level and is nested', () => {
            const reports_routes_length = getRoutesConfig().find(r => r.path === routes.reports).routes.length;
            expect(Object.keys(Helpers.findRouteByPath(routes.profit, getRoutesConfig()))).toEqual(
                expect.arrayContaining([
                    'path',
                    'component',
                    'is_authenticated',
                    'routes',
                    'icon_component',
                    'getTitle',
                ])
            );
            expect(Helpers.findRouteByPath(routes.profit, getRoutesConfig()).routes).toBeInstanceOf(Array);
            expect(Helpers.findRouteByPath(routes.profit, getRoutesConfig()).routes).toHaveLength(
                reports_routes_length
            );
            expect(Helpers.findRouteByPath(routes.profit, getRoutesConfig()).is_authenticated).toBe(true);
            expect(Helpers.findRouteByPath(routes.profit, getRoutesConfig()).path).toBe(routes.reports);
        });
    });

    describe('isRouteVisible', () => {
        it('should return true if route needs user to be authenticated and user is logged in', () => {
            expect(Helpers.isRouteVisible({ path: '/contract', is_authenticated: true }, true)).toBe(true);
        });
        it('should return false if route needs user to be authenticated and user is not logged in', () => {
            expect(Helpers.isRouteVisible({ path: '/contract', is_authenticated: true }, false)).toBe(false);
        });
        it('should return true if route does not need user to be authenticated and user is not logged in', () => {
            expect(Helpers.isRouteVisible({ path: '/contract', is_authenticated: false }, false)).toBe(true);
        });
        it('should return true if route does not need user to be authenticated and user is logged in', () => {
            expect(Helpers.isRouteVisible({ path: '/contract', is_authenticated: false }, true)).toBe(true);
        });
    });

    describe('getPath', () => {
        it('should return param values in params as a part of path', () => {
            expect(Helpers.getPath('/contract/:contract_id', { contract_id: 37511105068 })).toBe(
                '/contract/37511105068'
            );
            expect(
                Helpers.getPath('/something_made_up/:something_made_up_param1/:something_made_up_param2', {
                    something_made_up_param1: '789',
                    something_made_up_param2: '123456',
                })
            ).toBe('/something_made_up/789/123456');
        });
        it('should return path as before if there is no params', () => {
            expect(Helpers.getPath('/contract')).toBe('/contract');
        });
    });
});
