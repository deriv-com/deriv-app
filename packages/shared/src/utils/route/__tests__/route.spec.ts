import * as RouteUtils from '../route';

describe('isRouteVisible', () => {
    it('should return true if route needs user to be authenticated and user is logged in', () => {
        expect(RouteUtils.isRouteVisible({ path: '/contract', is_authenticated: true }, true)).toBe(true);
    });
    it('should return false if route needs user to be authenticated and user is not logged in', () => {
        expect(RouteUtils.isRouteVisible({ path: '/contract', is_authenticated: true }, false)).toBe(false);
    });
    it('should return true if route does not need user to be authenticated and user is not logged in', () => {
        expect(RouteUtils.isRouteVisible({ path: '/contract', is_authenticated: false }, false)).toBe(true);
    });
    it('should return true if route does not need user to be authenticated and user is logged in', () => {
        expect(RouteUtils.isRouteVisible({ path: '/contract', is_authenticated: false }, true)).toBe(true);
    });
});
