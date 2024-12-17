import { CFD_PLATFORMS } from '../../../constants';
import { getHighlightedIconLabel, getPlatformType } from '../compareAccountsConfig';

describe('compareAccountsConfig', () => {
    describe('getHighlightedIconLabel', () => {
        const mockLocalize = (text: string) => text;
        const defaultValues = {
            isEuRegion: false,
            localize: mockLocalize,
            platform: CFD_PLATFORMS.MT5,
        };

        describe('returns correct labels for different Forex instruments', () => {
            it('returns correct labels for Forex: standard/micro', () => {
                const result = getHighlightedIconLabel({
                    ...defaultValues,
                    instruments: ['Forex: standard/micro'],
                });

                expect(result[0]).toEqual({
                    highlighted: true,
                    icon: 'Forex',
                    text: 'Forex: standard/micro',
                });
            });

            it('returns correct labels for Forex: standard/exotic', () => {
                const result = getHighlightedIconLabel({
                    ...defaultValues,
                    instruments: ['Forex: standard/exotic'],
                });

                expect(result[0]).toEqual({
                    highlighted: true,
                    icon: 'Forex',
                    text: 'Forex: standard/exotic',
                });
            });

            it('returns correct labels for Forex: standard', () => {
                const result = getHighlightedIconLabel({
                    ...defaultValues,
                    instruments: ['Forex: standard'],
                });

                expect(result[0]).toEqual({
                    highlighted: true,
                    icon: 'Forex',
                    text: 'Forex: standard',
                });
            });

            it('returns correct labels for default Forex case', () => {
                const result = getHighlightedIconLabel({
                    ...defaultValues,
                    instruments: ['Forex'],
                });

                expect(result[0]).toEqual({
                    highlighted: true,
                    icon: 'Forex',
                    text: 'Forex',
                });
            });
        });

        it('returns correct labels and highlights for MT5', () => {
            const result = getHighlightedIconLabel({
                ...defaultValues,
                instruments: ['Stocks', 'Cryptocurrencies'],
            });

            expect(result[1]).toEqual({
                highlighted: true,
                icon: 'Stocks',
                text: 'Stocks',
            });
            expect(result[4]).toEqual({
                highlighted: true,
                icon: 'Cryptocurrencies',
                text: 'Cryptocurrencies',
            });
        });

        it('returns correct labels and highlights for cTrader', () => {
            const result = getHighlightedIconLabel({
                ...defaultValues,
                platform: CFD_PLATFORMS.CTRADER,
            });

            result.forEach(item => {
                expect(item.highlighted).toBe(true);
            });
            expect(result[0].text).toBe('Forex: major/minor');
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
