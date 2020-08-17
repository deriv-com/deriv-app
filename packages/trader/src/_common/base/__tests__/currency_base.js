const expect = require('chai').expect;
const formatMoney = require('@deriv/shared').formatMoney;
const formatCurrency = require('@deriv/shared').formatCurrency;
const isCryptocurrency = require('@deriv/shared').isCryptocurrency;
const getCurrencies = require('@deriv/shared').getCurrencies;
const getDecimalPlaces = require('@deriv/shared').getDecimalPlaces;
const addComma = require('@deriv/shared').addComma;
const setCurrencies = require('@deriv/shared').setCurrencies;

describe('Currency', () => {
    const currencies_config = {
        currencies_config: {
            AUD: { fractional_digits: 2, type: 'fiat' },
            EUR: { fractional_digits: 2, type: 'fiat' },
            GBP: { fractional_digits: 2, type: 'fiat' },
            USD: { fractional_digits: 2, type: 'fiat', transfer_between_accounts: { limits: { max: 2500, min: 1.0 } } },
            BTC: { fractional_digits: 8, type: 'crypto' },
        },
    };
    before(() => {
        setCurrencies(currencies_config);
    });

    describe('.formatMoney()', () => {
        it('works as expected', () => {
            expect(formatMoney('USD', '123.55')).to.eq(`${formatCurrency('USD')}123.55`);
            expect(formatMoney('GBP', '123.55')).to.eq(`${formatCurrency('GBP')}123.55`);
            expect(formatMoney('EUR', '123.55')).to.eq(`${formatCurrency('EUR')}123.55`);
            expect(formatMoney('AUD', '123.55')).to.eq(`${formatCurrency('AUD')}123.55`);
            expect(formatMoney('BTC', '0.005432110')).to.eq(`${formatCurrency('BTC')}0.00543211`);
            expect(formatMoney('BTC', '0.005432116')).to.eq(`${formatCurrency('BTC')}0.00543212`);
            expect(formatMoney('BTC', '0.00000001')).to.eq(`${formatCurrency('BTC')}0.00000001`);
            // don't remove trailing zeroes for now
            expect(formatMoney('BTC', '0.00010000')).to.eq(`${formatCurrency('BTC')}0.00010000`);
        });

        it('works with negative values', () => {
            expect(formatMoney('USD', '-123.55')).to.eq(`-${formatCurrency('USD')}123.55`);
        });

        it('works when exclude currency', () => {
            expect(formatMoney('USD', '123.55', 1)).to.eq('123.55');
        });
    });

    describe('.formatCurrency()', () => {
        it('works as expected', () => {
            expect(formatCurrency('USD')).to.eq('<span class="symbols usd"></span>');
        });
    });

    describe('.addComma()', () => {
        it('works as expected', () => {
            expect(addComma('123')).to.eq('123');
            expect(addComma('1234567')).to.eq('1,234,567');
        });

        it('works with decimal places', () => {
            expect(addComma('1234.5678')).to.eq('1,234.5678');
            expect(addComma('1234.5678', 2)).to.eq('1,234.57');
            expect(addComma('1234', 2)).to.eq('1,234.00');
            expect(addComma('1234.45', 0)).to.eq('1,234');
            expect(addComma('1234.56', 0)).to.eq('1,235');
        });

        it('works with negative numbers', () => {
            expect(addComma('-1234')).to.eq('-1,234');
        });

        it('handles null values', () => {
            expect(addComma()).to.eq('0');
            expect(addComma(null)).to.eq('0');
            expect(addComma(undefined)).to.eq('0');
            expect(addComma('')).to.eq('0');
        });
    });

    describe('.getDecimalPlaces()', () => {
        it('works as expected', () => {
            expect(getDecimalPlaces('AUD')).to.eq(2);
            expect(getDecimalPlaces('EUR')).to.eq(2);
            expect(getDecimalPlaces('GBP')).to.eq(2);
            expect(getDecimalPlaces('USD')).to.eq(2);
            expect(getDecimalPlaces('BTC')).to.eq(8);
        });

        it('works with undefined currencies', () => {
            expect(getDecimalPlaces('ZZZ')).to.eq(2);
        });
    });

    describe('.getCurrencies()', () => {
        it('works as expected', () => {
            expect(getCurrencies()).to.deep.eq(currencies_config.currencies_config);
        });
    });

    describe('.isCryptocurrency()', () => {
        it('works as expected', () => {
            expect(isCryptocurrency('AUD')).to.eq(false);
            expect(isCryptocurrency('EUR')).to.eq(false);
            expect(isCryptocurrency('GBP')).to.eq(false);
            expect(isCryptocurrency('USD')).to.eq(false);
            expect(isCryptocurrency('BTC')).to.eq(true);
        });

        it('works with undefined currencies', () => {
            expect(isCryptocurrency('ZZZ')).to.eq(false);
        });
    });
});
