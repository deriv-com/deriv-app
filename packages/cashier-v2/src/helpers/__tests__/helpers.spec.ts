import { getMT5AccountDetails } from '../helpers';

describe('getMT5AccountDetails()', () => {
    it('should return the correct landing company for name for MT5 accounts', () => {
        let landingCompany = getMT5AccountDetails('real\\p01_ts01\\financial\\svg_std-hr_usd').landingCompanyDetails
            .name;

        expect(landingCompany).toEqual('svg');

        landingCompany = getMT5AccountDetails('real\\p01_ts01\\financial\\bvi_std-hr_usd').landingCompanyDetails.name;

        expect(landingCompany).toEqual('bvi');

        landingCompany = getMT5AccountDetails('real\\p01_ts01\\financial\\labuan_std-hr_usd').landingCompanyDetails
            .name;

        expect(landingCompany).toEqual('labuan');

        landingCompany = getMT5AccountDetails('real\\p01_ts01\\financial\\vanuatu_std-hr_usd').landingCompanyDetails
            .name;

        expect(landingCompany).toEqual('vanuatu');
    });

    it('should return the correct MT5 market type', () => {
        let marketType = getMT5AccountDetails('real\\p01_ts01\\financial\\svg_std-hr_usd').marketTypeDetails.name;

        expect(marketType).toEqual('financial');

        marketType = getMT5AccountDetails('real\\p01_ts01\\synthetic\\svg_std-hr_usd').marketTypeDetails.name;

        expect(marketType).toEqual('synthetic');

        marketType = getMT5AccountDetails('real\\p01_ts01\\all\\svg_std-hr_usd').marketTypeDetails.name;

        expect(marketType).toEqual('all');
    });
});

describe('getMarketType()', () => {});
