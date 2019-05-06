const deep          = require('deep-diff'); // eslint-disable-line import/no-extraneous-dependencies
const activeSymbols = require('../active_symbols');
const { expect }    = require('../../../_common/__tests__/tests_common');

/*
    There is a market called forex, which has a submarket called major_pairs, which has a symbol called frxEURUSD
*/

const expected_markets_str = '{"indices":{"name":"Indices","is_active":1,"submarkets":{"europe_africa":{"name":"Europe/Africa","is_active":1,"symbols":{"OTC_AEX":{"display":"Dutch Index","symbol_type":"stockindex","is_active":1,"pip":"0.01","market":"indices","submarket":"europe_africa_OTC"},"OTC_SX5E":{"display":"Euro 50 Index","symbol_type":"stockindex","is_active":1,"pip":"0.01","market":"indices","submarket":"europe_africa_OTC"},"OTC_FCHI":{"display":"French Index","symbol_type":"stockindex","is_active":1,"pip":"0.01","market":"indices","submarket":"europe_africa_OTC"},"OTC_GDAXI":{"display":"German Index","symbol_type":"stockindex","is_active":1,"pip":"0.01","market":"indices","submarket":"europe_africa_OTC"},"OTC_IBEX35":{"display":"Spanish Index","symbol_type":"stockindex","is_active":1,"pip":"0.01","market":"indices","submarket":"europe_africa_OTC"},"OTC_SSMI":{"display":"Swiss Index","symbol_type":"stockindex","is_active":1,"pip":"0.01","market":"indices","submarket":"europe_africa_OTC"},"OTC_FTSE":{"display":"UK Index","symbol_type":"stockindex","is_active":1,"pip":"0.01","market":"indices","submarket":"europe_africa_OTC"}}},"asia_oceania":{"name":"Asia/Oceania","is_active":1,"symbols":{"OTC_AS51":{"display":"Australian Index","symbol_type":"stockindex","is_active":1,"pip":"0.01","market":"indices","submarket":"asia_oceania_OTC"},"OTC_HSI":{"display":"Hong Kong Index","symbol_type":"stockindex","is_active":1,"pip":"0.01","market":"indices","submarket":"asia_oceania_OTC"},"OTC_N225":{"display":"Japanese Index","symbol_type":"stockindex","is_active":1,"pip":"0.01","market":"indices","submarket":"asia_oceania_OTC"}}},"americas":{"name":"Americas","is_active":1,"symbols":{"OTC_SPC":{"display":"US Index","symbol_type":"stockindex","is_active":1,"pip":"0.01","market":"indices","submarket":"americas_OTC"},"OTC_NDX":{"display":"US Tech Index","symbol_type":"stockindex","is_active":1,"pip":"0.01","market":"indices","submarket":"americas_OTC"},"OTC_DJI":{"display":"Wall Street Index","symbol_type":"stockindex","is_active":1,"pip":"0.01","market":"indices","submarket":"americas_OTC"}}}}},"stocks":{"name":"OTC Stocks","is_active":1,"submarkets":{"ge_otc_stock":{"name":"Germany","is_active":1,"symbols":{"DEALV":{"display":"Allianz","symbol_type":"individualstock","is_active":1,"pip":"0.01","market":"stocks","submarket":"ge_otc_stock"},"DEDAI":{"display":"Daimler","symbol_type":"individualstock","is_active":1,"pip":"0.01","market":"stocks","submarket":"ge_otc_stock"},"DESIE":{"display":"Siemens","symbol_type":"individualstock","is_active":1,"pip":"0.01","market":"stocks","submarket":"ge_otc_stock"}}},"uk_otc_stock":{"name":"UK","is_active":1,"symbols":{"UKBARC":{"display":"Barclays","symbol_type":"individualstock","is_active":1,"pip":"0.01","market":"stocks","submarket":"uk_otc_stock"},"UKBATS":{"display":"British American Tobacco","symbol_type":"individualstock","is_active":1,"pip":"0.01","market":"stocks","submarket":"uk_otc_stock"},"UKHSBA":{"display":"HSBC","symbol_type":"individualstock","is_active":1,"pip":"0.01","market":"stocks","submarket":"uk_otc_stock"}}},"us_otc_stock":{"name":"US","is_active":1,"symbols":{"USAAPL":{"display":"Apple","symbol_type":"individualstock","is_active":1,"pip":"0.01","market":"stocks","submarket":"us_otc_stock"},"USAMZN":{"display":"Amazon.com","symbol_type":"individualstock","is_active":1,"pip":"0.01","market":"stocks","submarket":"us_otc_stock"},"USCT":{"display":"Citigroup","symbol_type":"individualstock","is_active":1,"pip":"0.01","market":"stocks","submarket":"us_otc_stock"},"USFB":{"display":"Facebook","symbol_type":"individualstock","is_active":1,"pip":"0.01","market":"stocks","submarket":"us_otc_stock"},"USGOOG":{"display":"Alphabet","symbol_type":"individualstock","is_active":1,"pip":"0.01","market":"stocks","submarket":"us_otc_stock"},"USMSFT":{"display":"Microsoft","symbol_type":"individualstock","is_active":1,"pip":"0.01","market":"stocks","submarket":"us_otc_stock"},"USXOM":{"display":"Exxon Mobil","symbol_type":"individualstock","is_active":1,"pip":"0.01","market":"stocks","submarket":"us_otc_stock"}}}}},"volidx":{"name":"Volatility Indices","is_active":1,"submarkets":{"random_daily":{"name":"Daily Reset Indices","is_active":1,"symbols":{"RDBEAR":{"display":"Bear Market Index","symbol_type":"stockindex","is_active":1,"pip":"0.0001","market":"volidx","submarket":"random_daily"},"RDBULL":{"display":"Bull Market Index","symbol_type":"stockindex","is_active":1,"pip":"0.0001","market":"volidx","submarket":"random_daily"}}},"random_index":{"name":"Continuous Indices","is_active":1,"symbols":{"R_100":{"display":"Volatility 100 Index","symbol_type":"stockindex","is_active":1,"pip":"0.01","market":"volidx","submarket":"random_index"},"R_25":{"display":"Volatility 25 Index","symbol_type":"stockindex","is_active":1,"pip":"0.001","market":"volidx","submarket":"random_index"},"R_50":{"display":"Volatility 50 Index","symbol_type":"stockindex","is_active":1,"pip":"0.0001","market":"volidx","submarket":"random_index"},"R_75":{"display":"Volatility 75 Index","symbol_type":"stockindex","is_active":1,"pip":"0.0001","market":"volidx","submarket":"random_index"}}}}},"forex":{"name":"Forex","is_active":1,"submarkets":{"smart_fx":{"name":"Smart FX","is_active":1,"symbols":{"WLDAUD":{"display":"AUD Index","symbol_type":"smart_fx","is_active":1,"pip":"0.001","market":"forex","submarket":"smart_fx"},"WLDEUR":{"display":"EUR Index","symbol_type":"smart_fx","is_active":1,"pip":"0.001","market":"forex","submarket":"smart_fx"},"WLDGBP":{"display":"GBP Index","symbol_type":"smart_fx","is_active":1,"pip":"0.001","market":"forex","submarket":"smart_fx"},"WLDUSD":{"display":"USD Index","symbol_type":"smart_fx","is_active":1,"pip":"0.001","market":"forex","submarket":"smart_fx"}}},"minor_pairs":{"name":"Minor Pairs","is_active":1,"symbols":{"frxAUDCAD":{"display":"AUD/CAD","symbol_type":"forex","is_active":1,"pip":"0.00001","market":"forex","submarket":"minor_pairs"},"frxAUDCHF":{"display":"AUD/CHF","symbol_type":"forex","is_active":1,"pip":"0.00001","market":"forex","submarket":"minor_pairs"},"frxAUDNZD":{"display":"AUD/NZD","symbol_type":"forex","is_active":1,"pip":"0.00001","market":"forex","submarket":"minor_pairs"},"frxAUDPLN":{"display":"AUD/PLN","symbol_type":"forex","is_active":1,"pip":"0.0001","market":"forex","submarket":"minor_pairs"},"frxEURNZD":{"display":"EUR/NZD","symbol_type":"forex","is_active":1,"pip":"0.00001","market":"forex","submarket":"minor_pairs"},"frxGBPCAD":{"display":"GBP/CAD","symbol_type":"forex","is_active":1,"pip":"0.00001","market":"forex","submarket":"minor_pairs"},"frxGBPCHF":{"display":"GBP/CHF","symbol_type":"forex","is_active":1,"pip":"0.00001","market":"forex","submarket":"minor_pairs"},"frxGBPNOK":{"display":"GBP/NOK","symbol_type":"forex","is_active":1,"pip":"0.0001","market":"forex","submarket":"minor_pairs"},"frxGBPNZD":{"display":"GBP/NZD","symbol_type":"forex","is_active":1,"pip":"0.00001","market":"forex","submarket":"minor_pairs"},"frxGBPPLN":{"display":"GBP/PLN","symbol_type":"forex","is_active":1,"pip":"0.0001","market":"forex","submarket":"minor_pairs"},"frxNZDJPY":{"display":"NZD/JPY","symbol_type":"forex","is_active":1,"pip":"0.001","market":"forex","submarket":"minor_pairs"},"frxNZDUSD":{"display":"NZD/USD","symbol_type":"forex","is_active":1,"pip":"0.00001","market":"forex","submarket":"minor_pairs"},"frxUSDMXN":{"display":"USD/MXN","symbol_type":"forex","is_active":1,"pip":"0.0001","market":"forex","submarket":"minor_pairs"},"frxUSDNOK":{"display":"USD/NOK","symbol_type":"forex","is_active":1,"pip":"0.00001","market":"forex","submarket":"minor_pairs"},"frxUSDPLN":{"display":"USD/PLN","symbol_type":"forex","is_active":1,"pip":"0.0001","market":"forex","submarket":"minor_pairs"},"frxUSDSEK":{"display":"USD/SEK","symbol_type":"forex","is_active":1,"pip":"0.00001","market":"forex","submarket":"minor_pairs"}}},"major_pairs":{"name":"Major Pairs","is_active":1,"symbols":{"frxAUDJPY":{"display":"AUD/JPY","symbol_type":"forex","is_active":1,"pip":"0.001","market":"forex","submarket":"major_pairs"},"frxAUDUSD":{"display":"AUD/USD","symbol_type":"forex","is_active":1,"pip":"0.00001","market":"forex","submarket":"major_pairs"},"frxEURAUD":{"display":"EUR/AUD","symbol_type":"forex","is_active":1,"pip":"0.00001","market":"forex","submarket":"major_pairs"},"frxEURCAD":{"display":"EUR/CAD","symbol_type":"forex","is_active":1,"pip":"0.00001","market":"forex","submarket":"major_pairs"},"frxEURCHF":{"display":"EUR/CHF","symbol_type":"forex","is_active":1,"pip":"0.00001","market":"forex","submarket":"major_pairs"},"frxEURGBP":{"display":"EUR/GBP","symbol_type":"forex","is_active":1,"pip":"0.00001","market":"forex","submarket":"major_pairs"},"frxEURJPY":{"display":"EUR/JPY","symbol_type":"forex","is_active":1,"pip":"0.001","market":"forex","submarket":"major_pairs"},"frxEURUSD":{"display":"EUR/USD","symbol_type":"forex","is_active":1,"pip":"0.00001","market":"forex","submarket":"major_pairs"},"frxGBPAUD":{"display":"GBP/AUD","symbol_type":"forex","is_active":1,"pip":"0.00001","market":"forex","submarket":"major_pairs"},"frxGBPJPY":{"display":"GBP/JPY","symbol_type":"forex","is_active":1,"pip":"0.001","market":"forex","submarket":"major_pairs"},"frxGBPUSD":{"display":"GBP/USD","symbol_type":"forex","is_active":1,"pip":"0.0001","market":"forex","submarket":"major_pairs"},"frxUSDCAD":{"display":"USD/CAD","symbol_type":"forex","is_active":1,"pip":"0.00001","market":"forex","submarket":"major_pairs"},"frxUSDCHF":{"display":"USD/CHF","symbol_type":"forex","is_active":1,"pip":"0.00001","market":"forex","submarket":"major_pairs"},"frxUSDJPY":{"display":"USD/JPY","symbol_type":"forex","is_active":1,"pip":"0.001","market":"forex","submarket":"major_pairs"}}}}},"commodities":{"name":"Commodities","is_active":1,"submarkets":{"energy":{"name":"Energy","is_active":1,"symbols":{"frxBROUSD":{"display":"Oil/USD","symbol_type":"commodities","is_active":1,"pip":"0.01","market":"commodities","submarket":"energy"}}},"metals":{"name":"Metals","is_active":1,"symbols":{"frxXAGUSD":{"display":"Silver/USD","symbol_type":"commodities","is_active":1,"pip":"0.0001","market":"commodities","submarket":"metals"},"frxXAUUSD":{"display":"Gold/USD","symbol_type":"commodities","is_active":1,"pip":"0.01","market":"commodities","submarket":"metals"},"frxXPDUSD":{"display":"Palladium/USD","symbol_type":"commodities","is_active":1,"pip":"0.01","market":"commodities","submarket":"metals"},"frxXPTUSD":{"display":"Platinum/USD","symbol_type":"commodities","is_active":1,"pip":"0.01","market":"commodities","submarket":"metals"}}}}}}';
const active_symbols = [
    {
        allow_forward_starting: 1,
        display_name: "EUR/USD",
        exchange_is_open: 1,
        is_trading_suspended: 0,
        market: "forex",
        market_display_name: "Forex",
        pip: "0.00001",
        submarket: "major_pairs",
        submarket_display_name: "Major Pairs",
        symbol: "frxEURUSD",
        symbol_type: "forex",
    }, {
        allow_forward_starting: 1,
        display_name: "Euro 50 Index",
        exchange_is_open: 1,
        is_trading_suspended: 0,
        market: "indices",
        market_display_name: "Indices",
        pip: "0.01",
        submarket: "europe_OTC",
        submarket_display_name: "Europe",
        symbol: "OTC_SX5E",
        symbol_type: "stockindex",
    }
];

const set_checks = (obj) => {
    if (obj instanceof Object) {
        delete obj.is_active;
        delete obj.display;
        Object.keys(obj).forEach((key) => {
            if (obj[key] instanceof Object) {
                set_checks(obj[key]);
            }
        });
    }
    return obj;
};

describe('ActiveSymbols', () => {
    it('Should have all functions that are being tested', () => {
        expect(activeSymbols).to.have.any.of.keys(['getMarkets', 'getSubmarkets', 'getMarketsList', 'getTradeUnderlyings', 'getSymbolNames']);
    });
    it('Should have correct keys in getMarkets return value', () => {
        const markets = activeSymbols.getMarkets(active_symbols);
        expect(markets).to.be.an('Object')
            .and.to.have.property('forex');
        expect(markets).to.have.property('indices');
        expect(markets).to.not.have.property('commodities');
        expect(markets.forex).to.have.property('name')
            .and.to.be.a('String');
        expect(markets.forex).to.have.property('is_active')
            .and.to.be.a('Number');
        expect(markets.forex).to.have.property('submarkets')
            .and.to.be.an('Object');
    });
    it('Should getSubmarkets have major_pairs and europe_OTC as a key, but not forex and minor_pairs', () => {
        const submarkets = activeSymbols.getSubmarkets(active_symbols);
        expect(submarkets).to.be.an('Object')
        expect(submarkets).to.have.property('major_pairs');
        expect(submarkets).to.have.property('europe_OTC');
        expect(submarkets).to.not.have.property('forex');
        expect(submarkets).to.not.have.property('minor_pairs');
    });
    it('Should getMarketsList have europe_OTC, major_pairs, forex and indices as keys', () => {
        const market_list = activeSymbols.getMarketsList(active_symbols);
        expect(market_list).to.be.an('Object')
            .and.to.have.all.of.keys(['europe_OTC', 'major_pairs', 'forex', 'indices']);
    });
    it('Should return correct values in getTradeUnderlyings', () => {
        const trade_underlyings = activeSymbols.getTradeUnderlyings(active_symbols);
        expect(trade_underlyings).to.be.an('Object')
            .and.to.have.property('forex')
            .and.to.have.property('frxEURUSD')
            .and.to.have.any.of.keys(['is_active', 'display', 'market', 'submarket']);
        expect(trade_underlyings).to.have.property('major_pairs')
            .and.to.have.property('frxEURUSD')
            .and.to.have.any.of.keys(['is_active', 'display', 'market', 'submarket']);
        expect(trade_underlyings).to.be.an('Object')
            .and.to.have.property('indices')
            .and.to.have.property('OTC_SX5E')
            .and.to.have.any.of.keys(['is_active', 'display', 'market', 'submarket']);
        expect(trade_underlyings).to.have.property('europe_OTC')
            .and.to.have.property('OTC_SX5E')
            .and.to.have.any.of.keys(['is_active', 'display', 'market', 'submarket']);
    });
    it('Should getSymbolNames have all symbol names', () => {
        const names = activeSymbols.getSymbolNames(active_symbols);
        expect(names).to.be.an('Object')
            .and.to.have.property('frxEURUSD');
        expect(names).to.have.property('OTC_SX5E');
    });
    it.skip('Should getMarkets output match the market snapshot', () => {
        const markets   = activeSymbols.getMarkets(active_symbols);
        const deep_diff = deep(set_checks(markets), set_checks(JSON.parse(expected_markets_str)));
        if (deep_diff) {
            deep_diff.forEach((diff) => {
                expect(diff).to.have.property('kind')
                    .and.not.to.be.equal('E');
            });
        }
    });
});
