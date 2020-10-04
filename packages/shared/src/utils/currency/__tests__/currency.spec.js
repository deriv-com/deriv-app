import { expect } from 'chai';
import * as CurrencyUtils from '../currency';

describe('CurrencyUtils', () => {
    const currencies_config = {
        currencies_config: {
            AUD: { fractional_digits: 2, type: 'fiat' },
            EUR: { fractional_digits: 2, type: 'fiat' },
            GBP: { fractional_digits: 2, type: 'fiat' },
            USD: { fractional_digits: 2, type: 'fiat', transfer_between_accounts: { limits: { max: 2500, min: 1.0 } } },
            BTC: { fractional_digits: 8, type: 'crypto' },
        },
    };
    beforeEach(() => {
        CurrencyUtils.setCurrencies(currencies_config);
    });

    describe('.formatMoney()', () => {
        it('works as expected', () => {
            expect(
                CurrencyUtils.formatMoney({
                    currency_value: 'USD',
                    amount: '123.55',
                })
            ).to.eq(`${CurrencyUtils.formatCurrency('USD')}123.55`);
            expect(
                CurrencyUtils.formatMoney({
                    currency_value: 'GBP',
                    amount: '123.55',
                })
            ).to.eq(`${CurrencyUtils.formatCurrency('GBP')}123.55`);
            expect(
                CurrencyUtils.formatMoney({
                    currency_value: 'EUR',
                    amount: '123.55',
                })
            ).to.eq(`${CurrencyUtils.formatCurrency('EUR')}123.55`);
            expect(
                CurrencyUtils.formatMoney({
                    currency_value: 'AUD',
                    amount: '123.55',
                })
            ).to.eq(`${CurrencyUtils.formatCurrency('AUD')}123.55`);
            expect(
                CurrencyUtils.formatMoney({
                    currency_value: 'BTC',
                    amount: '0.00543211',
                })
            ).to.eq(`${CurrencyUtils.formatCurrency('BTC')}0.00543211`);
            expect(
                CurrencyUtils.formatMoney({
                    currency_value: 'BTC',
                    amount: '0.00000001',
                })
            ).to.eq(`${CurrencyUtils.formatCurrency('BTC')}0.00000001`);
            // Remove trailing zeroes for cryptos
            expect(
                CurrencyUtils.formatMoney({
                    currency_value: 'BTC',
                    amount: '0.00010000',
                })
            ).to.eq(`${CurrencyUtils.formatCurrency('BTC')}0.0001`);
            expect(
                CurrencyUtils.formatMoney({
                    currency_value: 'BTC',
                    amount: '0.05432110',
                })
            ).to.eq(`${CurrencyUtils.formatCurrency('BTC')}0.0543211`);
        });

        it('works with negative values', () => {
            expect(
                CurrencyUtils.formatMoney({
                    currency_value: 'USD',
                    amount: '-123.55',
                })
            ).to.eq(`-${CurrencyUtils.formatCurrency('USD')}123.55`);
        });

        it('works when exclude currency', () => {
            expect(
                CurrencyUtils.formatMoney({
                    currency_value: 'USD',
                    amount: '123.55',
                    exclude_currency: true,
                })
            ).to.eq('123.55');
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
            expect(CurrencyUtils.getCurrencies()).to.deep.eq(currencies_config.currencies_config);
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

    describe('.getTransferLimits()', () => {
        it('returns limits based on input', () => {
            expect(CurrencyUtils.getTransferLimits('USD')).to.eq('1.00');
            expect(CurrencyUtils.getTransferLimits('USD', 'max')).to.eq('2500.00');
            expect(CurrencyUtils.getTransferLimits('BTC')).to.eq(undefined);
            expect(CurrencyUtils.getTransferLimits('BTC', 'max')).to.eq(undefined);
        });
    });
});
