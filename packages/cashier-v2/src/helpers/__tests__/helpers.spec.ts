import { getLandingCompanyTitleOfMT5Account, getMarketType } from '../helpers';

describe('getLandingCompanyTitleOfMT5Account()', () => {
    it('should return the correct landing company for name for MT5 accounts', () => {
        let landingCompany = getLandingCompanyTitleOfMT5Account('real\\p01_ts01\\financial\\svg_std-hr_usd');

        expect(landingCompany).toEqual('SVG');

        landingCompany = getLandingCompanyTitleOfMT5Account('real\\p01_ts01\\financial\\bvi_std-hr_usd');

        expect(landingCompany).toEqual('BVI');

        landingCompany = getLandingCompanyTitleOfMT5Account('real\\p01_ts01\\financial\\labuan_std-hr_usd');

        expect(landingCompany).toEqual('Labuan');

        landingCompany = getLandingCompanyTitleOfMT5Account('real\\p01_ts01\\financial\\vanuatu_std-hr_usd');

        expect(landingCompany).toEqual('Vanuatu');
    });
});

describe('getMarketType()', () => {
    it('should return the correct MT5 market type', () => {
        let marketType = getMarketType('real\\p01_ts01\\financial\\svg_std-hr_usd');

        expect(marketType).toEqual('Financial');

        marketType = getMarketType('real\\p01_ts01\\synthetic\\svg_std-hr_usd');

        expect(marketType).toEqual('Derived');

        marketType = getMarketType('real\\p01_ts01\\all\\svg_std-hr_usd');

        expect(marketType).toEqual('Swap-Free');
    });
});
