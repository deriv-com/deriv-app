import { routes } from '../../routes';
import { getPositionsV2TabIndexFromURL, POSITIONS_V2_TAB_NAME } from '../dtrader-v2-helpers';

describe('getPositionsV2TabIndexFromURL', () => {
    const originalWindowLocation = window.location;

    beforeEach(() => {
        Object.defineProperty(window, 'location', {
            configurable: true,
            enumerable: true,
            value: {
                hostname: 'https://localhost:8443/',
                pathname: routes.trader_positions,
            },
        });
    });

    afterEach(() => {
        Object.defineProperty(window, 'location', {
            configurable: true,
            enumerable: true,
            value: originalWindowLocation,
        });
        location.search = '';
    });

    it('should return 0 if it is an open tab in location.search', () => {
        location.search = `?tab_name=${POSITIONS_V2_TAB_NAME.OPEN.toLowerCase()}`;
        expect(getPositionsV2TabIndexFromURL()).toBe(0);
    });

    it('should return 1 if it is a closed tab in location.search', () => {
        location.search = `?tab_name=${POSITIONS_V2_TAB_NAME.CLOSED.toLowerCase()}`;
        expect(getPositionsV2TabIndexFromURL()).toBe(1);
    });

    it('should return 0 if there is no appropriate query param', () => {
        location.search = '';
        expect(getPositionsV2TabIndexFromURL()).toBe(0);
    });
});
