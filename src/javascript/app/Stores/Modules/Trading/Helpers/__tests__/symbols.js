import { expect }              from 'chai';
import React                   from 'react';
import { pickDefaultSymbol }   from '../symbol';
import { LocalStore }          from '_common/storage';

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
    },
    {
        "allow_forward_starting": 1,
        "display_name": "Japanese Index",
        "exchange_is_open": 0,
        "is_trading_suspended": 0,
        "market": "indices",
        "market_display_name": "Indices",
        "pip": "0.01",
        "submarket": "asia_oceania_OTC",
        "submarket_display_name": "Asia/Oceania",
        "symbol": "OTC_N225",
        "symbol_type": "stockindex"
    },
    {
        "allow_forward_starting": 1,
        "display_name": "Hong Kong Index",
        "exchange_is_open": 0,
        "is_trading_suspended": 0,
        "market": "indices",
        "market_display_name": "Indices",
        "pip": "0.01",
        "submarket": "asia_oceania_OTC",
        "submarket_display_name": "Asia/Oceania",
        "symbol": "OTC_HSI",
        "symbol_type": "stockindex"
    },
];    

describe('pickDefaultSymbol', () => {
    it('It Returns first open symbol if favorite list was empty', () => {
        const cq_favorites = {"indicators":[],"chartTitle&Comparison":[]};
        LocalStore.set('cq-favorites', JSON.stringify(cq_favorites));
        expect(pickDefaultSymbol(active_symbols)).to.eql('RDBEAR');
    });

    it('It Returns first open symbol if all symbols were close in favorite list', () => {
        const cq_favorites = {"indicators":[],"chartTitle&Comparison":["OTC_N225","OTC_HSI"]};
        LocalStore.set('cq-favorites', JSON.stringify(cq_favorites));
        expect(pickDefaultSymbol(active_symbols)).to.eql('RDBEAR');
    });

    it('It Returns the first open symbol in favorite list if an open symbol exist in favorite list', () => {
        const cq_favorites = {"indicators":[],"chartTitle&Comparison":["R_10","OTC_HSI"]};
        LocalStore.set('cq-favorites', JSON.stringify(cq_favorites));
        expect(pickDefaultSymbol(active_symbols)).to.eql('R_10');
    });

    it('It Returns a symbol which symbol.submarket is major_pairs|random_index if all active symbols were close', ()=> {
        const active_symbols = [
            {
                "allow_forward_starting": 1,
                "display_name": "AUD/USD",
                "exchange_is_open": 0,
                "is_trading_suspended": 0,
                "market": "forex",
                "market_display_name": "Forex",
                "pip": "0.00001",
                "submarket": "major_pairs",
                "submarket_display_name": "Major Pairs",
                "symbol": "frxAUDUSD",
                "symbol_type": "forex"
              },
            {
                "allow_forward_starting": 1,
                "display_name": "Japanese Index",
                "exchange_is_open": 0,
                "is_trading_suspended": 0,
                "market": "indices",
                "market_display_name": "Indices",
                "pip": "0.01",
                "submarket": "asia_oceania_OTC",
                "submarket_display_name": "Asia/Oceania",
                "symbol": "OTC_N225",
                "symbol_type": "stockindex"
              },
              {
                "allow_forward_starting": 1,
                "display_name": "Hong Kong Index",
                "exchange_is_open": 0,
                "is_trading_suspended": 0,
                "market": "indices",
                "market_display_name": "Indices",
                "pip": "0.01",
                "submarket": "asia_oceania_OTC",
                "submarket_display_name": "Asia/Oceania",
                "symbol": "OTC_HSI",
                "symbol_type": "stockindex"
              },
        ]
        expect(pickDefaultSymbol(active_symbols)).to.eql('frxAUDUSD');
    });

    it('It Returns the default symbol if active symbols has no value', () => {
        expect(pickDefaultSymbol()).to.be.empty;
    });
});
