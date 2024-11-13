import { localize } from '@deriv-com/translations';
import { CFD_PLATFORMS, MARKET_TYPE } from '../../../constants';
import { getHighlightedIconLabel, getPlatformType } from '../compareAccountsConfig';
import { JURISDICTION } from '../constants';

describe('compareAccountsConfig', () => {
    describe('getHighlightedIconLabel', () => {
        it('returns correct labels for synthetic market type', () => {
            const result = getHighlightedIconLabel(CFD_PLATFORMS.MT5, false, localize, MARKET_TYPE.SYNTHETIC, 'SVG');
            expect(result).toHaveLength(9);
            expect(result[0].text).toBe('Forex: standard');
        });

        it('returns correct labels for EU region', () => {
            const result = getHighlightedIconLabel(CFD_PLATFORMS.MT5, true, localize, MARKET_TYPE.SYNTHETIC, 'SVG');
            expect(result).toHaveLength(9);
            expect(result[0].text).toBe('Forex');
        });

        it('returns correct labels for financial market type with LABUAN jurisdiction', () => {
            const result = getHighlightedIconLabel(
                CFD_PLATFORMS.MT5,
                false,
                localize,
                MARKET_TYPE.FINANCIAL,
                JURISDICTION.LABUAN
            );
            expect(result).toHaveLength(9);
            expect(result[0].text).toBe('Forex: standard/exotic');
        });

        it('returns correct labels for financial market type with MALTAINVEST jurisdiction', () => {
            const result = getHighlightedIconLabel(
                CFD_PLATFORMS.MT5,
                false,
                localize,
                MARKET_TYPE.FINANCIAL,
                JURISDICTION.MALTAINVEST
            );
            expect(result).toHaveLength(6);
            expect(result[5].isAsterisk).toBe(true);
        });

        it('returns correct labels for ALL market type with MT5 platform', () => {
            const result = getHighlightedIconLabel(CFD_PLATFORMS.MT5, false, localize, MARKET_TYPE.ALL, 'SVG');
            expect(result).toHaveLength(9);
            expect(result[6].text).toBe('Synthetics indices');
        });

        it('returns correct labels for ALL market type with non-MT5 platform', () => {
            const result = getHighlightedIconLabel(CFD_PLATFORMS.CTRADER, false, localize, MARKET_TYPE.ALL, 'SVG');
            expect(result).toHaveLength(9);
            expect(result[6].text).toBe('Synthetic indices');
        });
    });

    describe('getPlatformType', () => {
        it('returns correct platform type', () => {
            expect(getPlatformType(CFD_PLATFORMS.MT5)).toBe('MT5');
            expect(getPlatformType(CFD_PLATFORMS.CTRADER)).toBe('CTrader');
            expect(getPlatformType(CFD_PLATFORMS.DXTRADE)).toBe('DerivX');
            // @ts-expect-error - mock unknown value to test output of default case
            expect(getPlatformType('unknown')).toBe('OtherCFDs');
        });
    });
});
