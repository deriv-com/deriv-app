import { expect } from 'chai';
import * as CurrencyUtils from '../currency';
import { TCurrenciesConfig } from '../currency';

describe('CurrencyUtils', () => {
    const website_status: { currencies_config: TCurrenciesConfig } = {
        currencies_config: {
            AUD: { fractional_digits: 2, type: 'fiat' },
            EUR: { fractional_digits: 2, type: 'fiat' },
            GBP: { fractional_digits: 2, type: 'fiat' },
            USD: { fractional_digits: 2, type: 'fiat', transfer_between_accounts: { limits: { max: 2500, min: 1.0 } } },
            BTC: { fractional_digits: 8, type: 'crypto' },
        },
    };
    beforeEach(() => {
        CurrencyUtils.setCurrencies(website_status);
    });

    describe('.formatMoney()', () => {
        it('works as expected', () => {
            expect(CurrencyUtils.formatMoney('USD', '123.55')).to.eq(`${CurrencyUtils.formatCurrency('USD')}123.55`);
            expect(CurrencyUtils.formatMoney('GBP', '123.55')).to.eq(`${CurrencyUtils.formatCurrency('GBP')}123.55`);
            expect(CurrencyUtils.formatMoney('EUR', '123.55')).to.eq(`${CurrencyUtils.formatCurrency('EUR')}123.55`);
            expect(CurrencyUtils.formatMoney('AUD', '123.55')).to.eq(`${CurrencyUtils.formatCurrency('AUD')}123.55`);
            expect(CurrencyUtils.formatMoney('BTC', '0.005432110')).to.eq(
                `${CurrencyUtils.formatCurrency('BTC')}0.00543211`
            );
            expect(CurrencyUtils.formatMoney('BTC', '0.005432116')).to.eq(
                `${CurrencyUtils.formatCurrency('BTC')}0.00543212`
            );
            expect(CurrencyUtils.formatMoney('BTC', '0.00000001')).to.eq(
                `${CurrencyUtils.formatCurrency('BTC')}0.00000001`
            );
            // don't remove trailing zeroes for now
            expect(CurrencyUtils.formatMoney('BTC', '0.00010000')).to.eq(
                `${CurrencyUtils.formatCurrency('BTC')}0.00010000`
            );
        });

        it('works with negative values', () => {
            expect(CurrencyUtils.formatMoney('USD', '-123.55')).to.eq(`-${CurrencyUtils.formatCurrency('USD')}123.55`);
        });

        it('works when exclude currency', () => {
            expect(CurrencyUtils.formatMoney('USD', '123.55', true)).to.eq('123.55');
        });
    });

    describe('.formatCurrency()', () => {
        it('works as expected', () => {
            expect(CurrencyUtils.formatCurrency('USD')).to.eq('<span class="symbols usd"></span>');
        });
    });

    describe('.addComma()', () => {
        it('works as expected', () => {
            expect(CurrencyUtils.addComma('123')).to.eq('123');
            expect(CurrencyUtils.addComma('1234567')).to.eq('1,234,567');
        });

        it('works with decimal places', () => {
            expect(CurrencyUtils.addComma('1234.5678')).to.eq('1,234.5678');
            expect(CurrencyUtils.addComma('1234.5678', 2)).to.eq('1,234.57');
            expect(CurrencyUtils.addComma('1234', 2)).to.eq('1,234.00');
            expect(CurrencyUtils.addComma('1234.45', 0)).to.eq('1,234');
            expect(CurrencyUtils.addComma('1234.56', 0)).to.eq('1,235');
        });

        it('works with negative numbers', () => {
            expect(CurrencyUtils.addComma('-1234')).to.eq('-1,234');
        });

        it('handles null values', () => {
            expect(CurrencyUtils.addComma()).to.eq('0');
            expect(CurrencyUtils.addComma(null)).to.eq('0');
            expect(CurrencyUtils.addComma(undefined)).to.eq('0');
            expect(CurrencyUtils.addComma('')).to.eq('0');
        });
    });

    describe('.getDecimalPlaces()', () => {
        it('works as expected', () => {
            expect(CurrencyUtils.getDecimalPlaces('AUD')).to.eq(2);
            expect(CurrencyUtils.getDecimalPlaces('EUR')).to.eq(2);
            expect(CurrencyUtils.getDecimalPlaces('GBP')).to.eq(2);
            expect(CurrencyUtils.getDecimalPlaces('USD')).to.eq(2);
            expect(CurrencyUtils.getDecimalPlaces('BTC')).to.eq(8);
        });

        it('works with undefined currencies', () => {
            expect(CurrencyUtils.getDecimalPlaces('ZZZ')).to.eq(2);
        });
    });

    describe('.getCurrencies()', () => {
        it('works as expected', () => {
            expect(CurrencyUtils.getCurrencies()).to.deep.eq(website_status.currencies_config);
        });
    });

    describe('.isCryptocurrency()', () => {
        it('works as expected', () => {
            expect(CurrencyUtils.isCryptocurrency('AUD')).to.eq(false);
            expect(CurrencyUtils.isCryptocurrency('EUR')).to.eq(false);
            expect(CurrencyUtils.isCryptocurrency('GBP')).to.eq(false);
            expect(CurrencyUtils.isCryptocurrency('USD')).to.eq(false);
            expect(CurrencyUtils.isCryptocurrency('BTC')).to.eq(true);
        });

        it('works with undefined currencies', () => {
            expect(CurrencyUtils.isCryptocurrency('ZZZ')).to.eq(false);
        });
    });
});
