import getRoutesConfig from '../routes-config';

describe('Routes Config', () => {
    it('should return default routes config', () => {
        const routes = getRoutesConfig();
        expect(routes).toHaveLength(3);
    });

    it('should return routes with contract route', () => {
        const routes = getRoutesConfig();
        expect(routes?.[0]?.path).toBe('/contract/:contract_id');
        expect(routes?.[0]?.component).toBeDefined();
        expect(routes?.[0]?.getTitle?.()).toBe('Contract Details');
        expect(routes?.[0]?.is_authenticated).toBe(true);
    });

    it('should return routes with trade route', () => {
        const routes = getRoutesConfig();
        expect(routes?.[1]?.path).toBe('/');
        expect(routes?.[1]?.component).toBeDefined();
        expect(routes?.[1]?.getTitle?.()).toBe('Trader');
    });

    it('should return routes config with default route including 404', () => {
        const routes = getRoutesConfig();
        expect(routes?.[2]?.getTitle?.()).toBe('Error 404');
        expect(routes?.[2]?.component).toBeDefined();
    });
});
