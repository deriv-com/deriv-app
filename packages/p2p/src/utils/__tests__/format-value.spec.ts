import {
    roundOffDecimal,
    setDecimalPlaces,
    percentOf,
    generateEffectiveRate,
    removeTrailingZeros,
    formatInput,
} from '../format-value';

describe('roundOffDecimal', () => {
    it('should return the rounded off value', () => {
        expect(roundOffDecimal(1.23456789, 2)).toEqual('1.23');
    });
});

describe('setDecimalPlaces', () => {
    it('should return the number with the decimal places set', () => {
        expect(setDecimalPlaces(1.23456789, 2)).toEqual(2);
    });
});

describe('percentOf', () => {
    it('should return the percent of the number', () => {
        expect(percentOf(1, 50)).toEqual(1.5);
    });
});

describe('generateEffectiveRate', () => {
    it('should return the effective rate and the display effective rate', () => {
        const params = {
            price: 1,
            rate: 50,
            local_currency: 'USD',
            exchange_rate: 1,
            market_rate: 1,
            rate_type: 'FIXED',
        };
        expect(generateEffectiveRate(params)).toEqual({
            effective_rate: 1.5,
            display_effective_rate: '1.50 ',
        });
    });
});

describe('removeTrailingZeros', () => {
    it('should return the number without trailing zeros', () => {
        expect(removeTrailingZeros('1.500000')).toEqual('1.50 ');
    });
});

describe('formatInput', () => {
    it('should return the formatted input', () => {
        expect(formatInput('1.500000', 'USD')).toEqual('1.500000 USD');
    });
});
