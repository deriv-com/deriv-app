import * as CurrencyUtils from '../currency';
import { TCurrenciesConfig } from '../currency';

describe('CurrencyUtils', () => {
    const website_status: { currenciesConfig: TCurrenciesConfig } = {
        currenciesConfig: {
            AUD: { fractionalDigits: 2, type: 'fiat' },
            EUR: { fractionalDigits: 2, type: 'fiat' },
            GBP: { fractionalDigits: 2, type: 'fiat' },
            USD: { fractionalDigits: 2, type: 'fiat', transferBetweenAccounts: { limits: { max: 2500, min: 1.0 } } },
            BTC: { fractionalDigits: 8, type: 'crypto' },
        },
    };
    beforeEach(() => {
        CurrencyUtils.setCurrencies(website_status);
    });

    describe('.formatMoney()', () => {
        it('works as expected', () => {
            expect(CurrencyUtils.formatMoney('USD', '123.55')).toBe(`${CurrencyUtils.formatCurrency('USD')}123.55`);
            expect(CurrencyUtils.formatMoney('GBP', '123.55')).toBe(`${CurrencyUtils.formatCurrency('GBP')}123.55`);
            expect(CurrencyUtils.formatMoney('EUR', '123.55')).toBe(`${CurrencyUtils.formatCurrency('EUR')}123.55`);
            expect(CurrencyUtils.formatMoney('AUD', '123.55')).toBe(`${CurrencyUtils.formatCurrency('AUD')}123.55`);
            expect(CurrencyUtils.formatMoney('BTC', '0.005432110')).toBe(
                `${CurrencyUtils.formatCurrency('BTC')}0.00543211`
            );
            expect(CurrencyUtils.formatMoney('BTC', '0.005432116')).toBe(
                `${CurrencyUtils.formatCurrency('BTC')}0.00543212`
            );
            expect(CurrencyUtils.formatMoney('BTC', '0.00000001')).toBe(
                `${CurrencyUtils.formatCurrency('BTC')}0.00000001`
            );
            // don't remove trailing zeroes for now
            expect(CurrencyUtils.formatMoney('BTC', '0.00010000')).toBe(
                `${CurrencyUtils.formatCurrency('BTC')}0.00010000`
            );
        });

        it('works with negative values', () => {
            expect(CurrencyUtils.formatMoney('USD', '-123.55')).toBe(`-${CurrencyUtils.formatCurrency('USD')}123.55`);
        });

        it('works when exclude currency', () => {
            expect(CurrencyUtils.formatMoney('USD', '123.55', true)).toBe('123.55');
        });
    });

    describe('.formatCurrency()', () => {
        it('works as expected', () => {
            expect(CurrencyUtils.formatCurrency('USD')).toBe('<span class="symbols usd"></span>');
        });
    });

    describe('.addComma()', () => {
        it('works as expected', () => {
            expect(CurrencyUtils.addComma('123')).toBe('123');
            expect(CurrencyUtils.addComma('1234567')).toBe('1,234,567');
        });

        it('works with decimal places', () => {
            expect(CurrencyUtils.addComma('1234.5678')).toBe('1,234.5678');
            expect(CurrencyUtils.addComma('1234.5678', 2)).toBe('1,234.57');
            expect(CurrencyUtils.addComma('1234', 2)).toBe('1,234.00');
            expect(CurrencyUtils.addComma('1234.45', 0)).toBe('1,234');
            expect(CurrencyUtils.addComma('1234.56', 0)).toBe('1,235');
        });

        it('works with negative numbers', () => {
            expect(CurrencyUtils.addComma('-1234')).toBe('-1,234');
        });

        it('handles null values', () => {
            expect(CurrencyUtils.addComma()).toBe('0');
            expect(CurrencyUtils.addComma(null)).toBe('0');
            expect(CurrencyUtils.addComma('')).toBe('0');
        });
    });

    describe('.getDecimalPlaces()', () => {
        it('works as expected', () => {
            expect(CurrencyUtils.getDecimalPlaces('AUD')).toBe(2);
            expect(CurrencyUtils.getDecimalPlaces('EUR')).toBe(2);
            expect(CurrencyUtils.getDecimalPlaces('GBP')).toBe(2);
            expect(CurrencyUtils.getDecimalPlaces('USD')).toBe(2);
            expect(CurrencyUtils.getDecimalPlaces('BTC')).toBe(8);
        });

        it('works with dummy currencies', () => {
            expect(CurrencyUtils.getDecimalPlaces('ZZZ')).toBe(2);
        });

        it('works with undefined', () => {
            expect(CurrencyUtils.getDecimalPlaces()).toBe(2);
        });
    });

    describe('.isCryptocurrency()', () => {
        it('works as expected', () => {
            expect(CurrencyUtils.isCryptocurrency('AUD')).toBe(false);
            expect(CurrencyUtils.isCryptocurrency('EUR')).toBe(false);
            expect(CurrencyUtils.isCryptocurrency('GBP')).toBe(false);
            expect(CurrencyUtils.isCryptocurrency('USD')).toBe(false);
            expect(CurrencyUtils.isCryptocurrency('BTC')).toBe(true);
        });

        it('works with undefined currencies', () => {
            expect(CurrencyUtils.isCryptocurrency('ZZZ')).toBe(false);
        });
    });
});
