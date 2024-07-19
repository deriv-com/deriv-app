import { TRADE_TYPES } from '@deriv/shared';
import { getTradeParams } from '../trade-params-utils';

describe('getTradeParams', () => {
    it('should return correct array with keys for Rise/Fall', () => {
        expect(getTradeParams()[TRADE_TYPES.RISE_FALL]).toEqual(['duration', 'stake', 'allow_equals']);
    });

    it('should return correct array with keys for Multipliers if symbol does not start with "cry"', () => {
        expect(getTradeParams()[TRADE_TYPES.MULTIPLIER]).toEqual([
            'multiplier',
            'stake',
            'risk_management',
            'mult_info_display',
        ]);
    });

    it('should return correct array with keys for Multipliers if symbol starts with "cry"', () => {
        expect(getTradeParams('crypto')[TRADE_TYPES.MULTIPLIER]).toEqual([
            'multiplier',
            'stake',
            'risk_management',
            'expiration',
            'mult_info_display',
        ]);
    });
});
