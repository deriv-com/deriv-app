import React from 'react';
import { buildCurrenciesList, getDefaultCurrency } from '../currency';

describe('buildCurrenciesList', () => {
    const payout_currencies = ['AUD', 'BTC', 'ETH', 'EUR', 'LTC', 'USD'];

    it('It Returns the desired currencies', () => {
        expect(buildCurrenciesList(payout_currencies)).toEqual({
            Fiat: [
                {
                    has_tooltip: false,
                    text: 'AUD',
                    value: 'AUD',
                },
                {
                    has_tooltip: false,
                    text: 'EUR',
                    value: 'EUR',
                },
                {
                    has_tooltip: false,
                    text: 'USD',
                    value: 'USD',
                },
            ],
            Crypto: [
                {
                    has_tooltip: true,
                    text: 'BTC',
                    value: 'BTC',
                },
                {
                    has_tooltip: true,
                    text: 'ETH',
                    value: 'ETH',
                },
                {
                    has_tooltip: true,
                    text: 'LTC',
                    value: 'LTC',
                },
            ],
        });
    });

    it('Returns correct default currency when currency is passed', () => {
        const currencies_list = buildCurrenciesList(payout_currencies);
        expect(getDefaultCurrency(currencies_list, 'EUR')).toEqual({
            currency: 'EUR',
        });
    });

    it('Returns first currency in currencies list when currency is not passed', () => {
        const currencies_list = buildCurrenciesList(payout_currencies);
        expect(getDefaultCurrency(currencies_list)).toEqual({
            currency: 'AUD',
        });
    });
});
