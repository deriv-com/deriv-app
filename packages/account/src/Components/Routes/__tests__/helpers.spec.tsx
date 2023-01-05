import { findRouteByPath, getContractPath, getPath, isRouteVisible, normalizePath } from '../helpers';

describe('helpers', () => {
    it('normalizePath should return string path', () => {
        expect(typeof normalizePath('test/path')).toBe('string');
        expect(normalizePath('test/path')).toBe('/test/path');
        expect(normalizePath('/test/path/with-slash')).toBe('/test/path/with-slash');
        expect(normalizePath('')).toBe('/');
    });

    it('isRouteVisible should return expected boolean', () => {
        const route = { is_authenticated: false };
        let is_logged_in = false;

        expect(typeof isRouteVisible(route, is_logged_in)).toBe('boolean');
        expect(isRouteVisible()).toBe(true);
        expect(isRouteVisible(route, is_logged_in)).toBe(true);

        route.is_authenticated = true;
        expect(isRouteVisible(route, is_logged_in)).toBe(false);

        is_logged_in = true;
        expect(isRouteVisible(route, is_logged_in)).toBe(true);
    });

    it('findRouteByPath should return expected route object', () => {
        const routes_config = [
            {
                path: 'test/path/1',
                component: 'TestComponent_1',
            },
            {
                path: 'test/path/2',
                component: 'TestComponent_2',
                routes: [
                    {
                        path: 'test/path/subroute_1',
                        component: 'TestSubComponent_1',
                    },
                    {
                        path: 'test/path/subroute_2',
                        component: 'TestSubComponent_2',
                    },
                ],
            },
        ];

        let path = '';
        expect(typeof findRouteByPath(path, routes_config)).toBe('undefined');

        path = 'test/path/1';
        expect(typeof findRouteByPath(path, routes_config)).toBe('object');
        expect(findRouteByPath(path, routes_config).path).toBe('test/path/1');
        expect(findRouteByPath(path, routes_config).component).toBe('TestComponent_1');

        path = 'test/path/subroute_2';
        expect(typeof findRouteByPath(path, routes_config)).toBe('object');
        expect(findRouteByPath(path, routes_config).path).toBe('test/path/subroute_2');
        expect(findRouteByPath(path, routes_config).component).toBe('TestSubComponent_2');
    });

    it('getPath should return expected path', () => {
        let route_path = '/test/path/:param_1';
        expect(getPath(route_path, { param_1: 1234567890 })).toBe('/test/path/1234567890');

        route_path = '/test/path/:param_1:param_2';
        expect(getPath(route_path, { param_1: 'first', param_2: 'second' })).toBe('/test/path/firstsecond');
    });

    it('getContractPath should return expected contract path with passed contract id', () => {
        expect(getContractPath('test_contract_id')).toBe('/contract/test_contract_id');
    });
});
