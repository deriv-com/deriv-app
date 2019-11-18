import { expect }              from 'chai';
import { LocalStore }          from '_common/storage';
import { pickDefaultSymbol }   from '../active-symbols';
import React                   from 'react';

const active_symbols = [
    {
        "allow_forward_starting": 1,
        "display_name": "Bear Market Index",
        "exchange_is_open": 1,
        "is_trading_suspended": 0,
        "market": "synthetic_index",
        "market_display_name": "Synthetic Indices",
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
        "market": "synthetic_index",
        "market_display_name": "Synethetic Indices",
        "pip": "0.0001",
        "submarket": "random_daily",
        "submarket_display_name": "Daily Reset Indices",
        "symbol": "RDBULL",
        "symbol_type": "stockindex"
    },
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
        "display_name": "Volatility 10 Index",
        "exchange_is_open": 0,
        "is_trading_suspended": 0,
        "market": "synthetic_index",
        "market_display_name": "Synthetic Indices",
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
        "market": "synthetic_index",
        "market_display_name": "Synthetic Indices",
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
        "market": "synthetic_index",
        "market_display_name": "Synthetic Indices",
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
        "market": "synthetic_index",
        "market_display_name": "Synthetic Indices",
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
        "market": "synthetic_index",
        "market_display_name": "Synthetic Indices",
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
    it('It should return the first open symbol in major_pairs or random_index if the user does not have a favorite symbol', () => {
        const cq_favorites = {"indicators":[],"chartTitle&Comparison":[]};
        LocalStore.set('cq-favorites', JSON.stringify(cq_favorites));
        expect(pickDefaultSymbol(active_symbols)).to.eql('R_25');
    });

    it('It Returns first open major_pair or random_index symbol if all symbols were close in favorite list', () => {
        const cq_favorites = {"indicators":[],"chartTitle&Comparison":["OTC_N225","OTC_HSI"]};
        LocalStore.set('cq-favorites', JSON.stringify(cq_favorites));
        expect(pickDefaultSymbol(active_symbols)).to.eql('R_25');
    });

    it('It Returns the first open symbol in favorite list if an open symbol exist in the favorite list', () => {
        const cq_favorites = {"indicators":[],"chartTitle&Comparison":["OTC_HSI","R_50"]};
        LocalStore.set('cq-favorites', JSON.stringify(cq_favorites));
        expect(pickDefaultSymbol(active_symbols)).to.eql('R_50');
    });

    it('It Returns a major_pairs symbol if all active symbols were close', ()=> {
        const active_symbols = [
            {
                "allow_forward_starting": 1,
                "display_name": "Bear Market Index",
                "exchange_is_open": 0,
                "is_trading_suspended": 0,
                "market": "synthetic_index",
                "market_display_name": "Synthetic Indices",
                "pip": "0.0001",
                "submarket": "random_daily",
                "submarket_display_name": "Daily Reset Indices",
                "symbol": "RDBEAR",
                "symbol_type": "stockindex"
            },
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
              "display_name": "Volatility 10 Index",
              "exchange_is_open": 0,
              "is_trading_suspended": 0,
              "market": "synthetic_index",
              "market_display_name": "Synthetic Indices",
              "pip": "0.001",
              "submarket": "random_index",
              "submarket_display_name": "Continuous Indices",
              "symbol": "R_10",
              "symbol_type": "stockindex"
          }
      ]
        expect(pickDefaultSymbol(active_symbols)).to.eql('frxAUDUSD');
    });

    it('It should return empty value for the default symbol if there are no active_symbols.', () => {
        expect(pickDefaultSymbol()).to.be.empty;
    });
});
