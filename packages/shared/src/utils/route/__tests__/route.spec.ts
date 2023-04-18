import * as RouteUtils from '../route';

describe('isRouteVisible', () => {
    const mockRoute = {
        count: 0,
        default: undefined,
        has_side_note: false,
        icon: 'IcDp2p',
        label: 'Deriv P2P',
        path: '/cashier/p2p',
    };

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
    it('should return true if user is trying to get to my-ads subroute in p2p', () => {
        expect(RouteUtils.matchRoute(mockRoute, '/cashier/p2p/my-ads')).toBe(true);
    });
});
