import { getAccountName, getLandingCompanyNameOfMT5Account, getMarketType } from '../helpers';

describe('getAccountName()', () => {
    it('should return correct account name for deriv apps account', () => {
        let accountName = getAccountName({
            accountCategory: 'trading',
            accountType: 'binary',
        });

        expect(accountName).toEqual('Deriv Apps');

        accountName = getAccountName({
            accountCategory: 'trading',
            accountType: 'standard',
        });

        expect(accountName).toEqual('Deriv Apps');
    });

    it('should return correct account name for Deriv X account', () => {
        const accountName = getAccountName({
            accountCategory: 'trading',
            accountType: 'dxtrade',
        });

        expect(accountName).toEqual('Deriv X');
    });

    it('should return correct account name for cTrader account', () => {
        const accountName = getAccountName({
            accountCategory: 'trading',
            accountType: 'ctrader',
        });

        expect(accountName).toEqual('Deriv cTrader');
    });

    it('should return correct account name for MT5 Financial account', () => {
        const accountName = getAccountName({
            accountCategory: 'trading',
            accountType: 'mt5',
            mt5MarketType: 'financial',
        });

        expect(accountName).toEqual('MT5 Financial');
    });

    it('should return correct account name for MT5 Derived account', () => {
        const accountName = getAccountName({
            accountCategory: 'trading',
            accountType: 'mt5',
            mt5MarketType: 'synthetic',
        });

        expect(accountName).toEqual('MT5 Derived');
    });

    it('should return correct account name for MT5 Swap-Free account', () => {
        const accountName = getAccountName({
            accountCategory: 'trading',
            accountType: 'mt5',
            mt5MarketType: 'all',
        });

        expect(accountName).toEqual('MT5 Swap-Free');
    });
});

describe('getLandingCompanyNameOfMT5Account()', () => {
    it('should return the correct landing company for name for MT5 accounts', () => {
        let landingCompany = getLandingCompanyNameOfMT5Account('real\\p01_ts01\\financial\\svg_std-hr_usd');

        expect(landingCompany).toEqual('svg');

        landingCompany = getLandingCompanyNameOfMT5Account('real\\p01_ts01\\financial\\bvi_std-hr_usd');

        expect(landingCompany).toEqual('bvi');

        landingCompany = getLandingCompanyNameOfMT5Account('real\\p01_ts01\\financial\\labuan_std-hr_usd');

        expect(landingCompany).toEqual('labuan');

        landingCompany = getLandingCompanyNameOfMT5Account('real\\p01_ts01\\financial\\labuan_std-hr_usd');

        expect(landingCompany).toEqual('labuan');

        landingCompany = getLandingCompanyNameOfMT5Account('real\\p01_ts01\\financial\\vanuatu_std-hr_usd');

        expect(landingCompany).toEqual('vanuatu');
    });
});

describe('getMarketType()', () => {
    it('should return the correct MT5 market type', () => {
        let marketType = getMarketType('real\\p01_ts01\\financial\\svg_std-hr_usd');

        expect(marketType).toEqual('financial');

        marketType = getMarketType('real\\p01_ts01\\synthetic\\svg_std-hr_usd');

        expect(marketType).toEqual('synthetic');

        marketType = getMarketType('real\\p01_ts01\\all\\svg_std-hr_usd');

        expect(marketType).toEqual('all');
    });
});
