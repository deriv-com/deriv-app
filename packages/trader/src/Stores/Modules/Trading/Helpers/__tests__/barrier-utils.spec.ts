import { getHoveredColor } from '../barrier-utils';
import { TRADE_TYPES } from '@deriv/shared';

describe('getHoveredColor', () => {
    it('should return red color (#ec3f3f) if passed value is TRADE_TYPES.TURBOS.SHORT', () => {
        expect(getHoveredColor(TRADE_TYPES.TURBOS.SHORT.toUpperCase())).toEqual('#ec3f3f');
    });
    it('should return green color (#4bb4b3) if passed value is TRADE_TYPES.TURBOS.LONG', () => {
        expect(getHoveredColor(TRADE_TYPES.TURBOS.LONG.toUpperCase())).toEqual('#4bb4b3');
    });
    it('should return gray color (#999999) if passed value not TRADE_TYPES.TURBOS.LONG or TRADE_TYPES.TURBOS.SHORT', () => {
        expect(getHoveredColor('TESTTYPE')).toEqual('#999999');
    });
});
