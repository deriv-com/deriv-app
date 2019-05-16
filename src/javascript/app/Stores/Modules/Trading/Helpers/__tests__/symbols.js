import { expect }              from 'chai';
import React                   from 'react';
import { pickDefaultSymbol }   from '../active-symbols';

describe('pickDefaultSymbol', () => {
    it('It Returns the default symbol if active symbols has value', () => {
        const active_symbols = [
            {
                "allow_forward_starting": 1,
                "display_name": "Bear Market Index",
                "exchange_is_open": 1,
                "is_trading_suspended": 0,
                "market": "volidx",
                "market_display_name": "Volatility Indices",
                "pip": "0.0001",
                "submarket": "random_daily",
                "submarket_display_name": "Daily Reset Indices",
                "symbol": "RDBEAR",
                "symbol_type": "stockindex"
            },
            {
                "allow_forward_starting": 1,
                "display_name": "Bull Market Index",
                "exchange_is_open": 1,
                "is_trading_suspended": 0,
                "market": "volidx",
                "market_display_name": "Volatility Indices",
                "pip": "0.0001",
                "submarket": "random_daily",
                "submarket_display_name": "Daily Reset Indices",
                "symbol": "RDBULL",
                "symbol_type": "stockindex"
            },
            {
                "allow_forward_starting": 1,
                "display_name": "Volatility 10 Index",
                "exchange_is_open": 1,
                "is_trading_suspended": 0,
                "market": "volidx",
                "market_display_name": "Volatility Indices",
                "pip": "0.001",
                "submarket": "random_index",
                "submarket_display_name": "Continuous Indices",
                "symbol": "R_10",
                "symbol_type": "stockindex"
            },
            {
                "allow_forward_starting": 1,
                "display_name": "Volatility 25 Index",
                "exchange_is_open": 1,
                "is_trading_suspended": 0,
                "market": "volidx",
                "market_display_name": "Volatility Indices",
                "pip": "0.001",
                "submarket": "random_index",
                "submarket_display_name": "Continuous Indices",
                "symbol": "R_25",
                "symbol_type": "stockindex"
            },
            {
                "allow_forward_starting": 1,
                "display_name": "Volatility 50 Index",
                "exchange_is_open": 1,
                "is_trading_suspended": 0,
                "market": "volidx",
                "market_display_name": "Volatility Indices",
                "pip": "0.0001",
                "submarket": "random_index",
                "submarket_display_name": "Continuous Indices",
                "symbol": "R_50",
                "symbol_type": "stockindex"
            },
            {
                "allow_forward_starting": 1,
                "display_name": "Volatility 75 Index",
                "exchange_is_open": 1,
                "is_trading_suspended": 0,
                "market": "volidx",
                "market_display_name": "Volatility Indices",
                "pip": "0.0001",
                "submarket": "random_index",
                "submarket_display_name": "Continuous Indices",
                "symbol": "R_75",
                "symbol_type": "stockindex"
            },
            {
                "allow_forward_starting": 1,
                "display_name": "Volatility 100 Index",
                "exchange_is_open": 1,
                "is_trading_suspended": 0,
                "market": "volidx",
                "market_display_name": "Volatility Indices",
                "pip": "0.01",
                "submarket": "random_index",
                "submarket_display_name": "Continuous Indices",
                "symbol": "R_100",
                "symbol_type": "stockindex"
            }
        ];

        expect(pickDefaultSymbol(active_symbols)).to.eql('R_10');
    });

    it('It Returns the default symbol if active symbols has no value', () => {
        expect(pickDefaultSymbol()).to.be.empty;
    });

});
