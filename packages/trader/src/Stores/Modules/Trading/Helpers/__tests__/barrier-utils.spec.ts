import { getHoveredColor } from '../barrier-utils';
import { CONTRACT_TYPES } from '@deriv/shared';

describe('getHoveredColor', () => {
    it('should return red color (#ec3f3f) if passed value is TRADE_TYPES.TURBOS.SHORT', () => {
        expect(getHoveredColor(CONTRACT_TYPES.TURBOS.SHORT)).toEqual('#ec3f3f');
    });
    it('should return green color (#4bb4b3) if passed value is TRADE_TYPES.TURBOS.LONG', () => {
        expect(getHoveredColor(CONTRACT_TYPES.TURBOS.LONG)).toEqual('#4bb4b3');
    });
    it('should return blue color (#377cfc) if passed value not TRADE_TYPES.TURBOS.LONG or TRADE_TYPES.TURBOS.SHORT', () => {
        expect(getHoveredColor('TESTTYPE')).toEqual('#377cfc');
    });
});
