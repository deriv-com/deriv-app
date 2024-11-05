import { LandingCompanyDetails, MT5MarketTypeDetails, PlatformDetails } from '../../constants';
import { getAccountName, getLandingCompanyNameOfMT5Account, getMarketType } from '../helpers';

describe('Cashier Helpers', () => {
    describe('getMarketType', () => {
        it('returns correct market type for financial', () => {
            expect(getMarketType('financial_svg')).toBe(MT5MarketTypeDetails.financial.name);
        });

        it('returns correct market type for synthetic', () => {
            expect(getMarketType('synthetic_svg')).toBe(MT5MarketTypeDetails.synthetic.name);
        });

        it('returns correct market type for all', () => {
            expect(getMarketType('all_svg')).toBe(MT5MarketTypeDetails.all.name);
        });

        it('returns undefined for unknown market type', () => {
            expect(getMarketType('unknown_svg')).toBeUndefined();
        });
    });

    describe('getLandingCompanyNameOfMT5Account', () => {
        it('returns correct landing company name for BVI', () => {
            expect(getLandingCompanyNameOfMT5Account('financial_bvi')).toBe(LandingCompanyDetails.bvi.name);
        });

        it('returns correct landing company name for Labuan', () => {
            expect(getLandingCompanyNameOfMT5Account('financial_labuan')).toBe(LandingCompanyDetails.labuan.name);
        });

        it('returns correct landing company name for SVG', () => {
            expect(getLandingCompanyNameOfMT5Account('financial_svg')).toBe(LandingCompanyDetails.svg.name);
        });

        it('returns correct landing company name for Vanuatu', () => {
            expect(getLandingCompanyNameOfMT5Account('financial_vanuatu')).toBe(LandingCompanyDetails.vanuatu.name);
        });

        it('returns SVG for unknown landing company', () => {
            expect(getLandingCompanyNameOfMT5Account('financial_unknown')).toBe(LandingCompanyDetails.svg.name);
        });
    });

    describe('getAccountName', () => {
        it('returns correct name for wallet account', () => {
            expect(
                getAccountName({
                    accountCategory: 'wallet',
                    accountType: 'standard',
                    displayCurrencyCode: 'USD',
                    landingCompanyName: 'svg',
                })
            ).toBe('USD Wallet');
        });

        it('returns correct name for standard trading account', () => {
            expect(
                getAccountName({
                    accountCategory: 'trading',
                    accountType: PlatformDetails.standard.name,
                    landingCompanyName: 'svg',
                })
            ).toBe(PlatformDetails.standard.title);
        });

        it('returns correct name for DTrader account', () => {
            expect(
                getAccountName({
                    accountCategory: 'trading',
                    accountType: PlatformDetails.dxtrade.name,
                    landingCompanyName: 'svg',
                })
            ).toBe(PlatformDetails.dxtrade.title);
        });

        it('returns correct name for cTrader account', () => {
            expect(
                getAccountName({
                    accountCategory: 'trading',
                    accountType: PlatformDetails.ctrader.name,
                    landingCompanyName: 'svg',
                })
            ).toBe(PlatformDetails.ctrader.title);
        });

        it('returns correct name for MT5 financial account', () => {
            expect(
                getAccountName({
                    accountCategory: 'trading',
                    accountType: PlatformDetails.mt5.name,
                    landingCompanyName: 'svg',
                    mt5MarketType: MT5MarketTypeDetails.financial.name,
                })
            ).toBe(MT5MarketTypeDetails.financial.landingCompany?.svg.title);
        });

        it('returns correct name for MT5 financial STP account', () => {
            expect(
                getAccountName({
                    accountCategory: 'trading',
                    accountType: PlatformDetails.mt5.name,
                    landingCompanyName: 'svg',
                    mt5MarketType: MT5MarketTypeDetails.financial.name,
                    product: 'stp',
                })
            ).toBe(MT5MarketTypeDetails.financial.product?.stp?.title);
        });

        it('returns correct name for MT5 synthetic account', () => {
            expect(
                getAccountName({
                    accountCategory: 'trading',
                    accountType: PlatformDetails.mt5.name,
                    landingCompanyName: 'svg',
                    mt5MarketType: MT5MarketTypeDetails.synthetic.name,
                })
            ).toBe(MT5MarketTypeDetails.synthetic.title);
        });

        it('returns correct name for MT5 all account', () => {
            expect(
                getAccountName({
                    accountCategory: 'trading',
                    accountType: PlatformDetails.mt5.name,
                    landingCompanyName: 'svg',
                    mt5MarketType: MT5MarketTypeDetails.all.name,
                })
            ).toBe(MT5MarketTypeDetails.all.title);
        });

        it('returns empty string for unknown account category', () => {
            expect(
                getAccountName({
                    accountCategory: undefined,
                    accountType: undefined,
                    landingCompanyName: 'svg',
                })
            ).toBe('');
        });

        it('returns empty string for unknown trading account type', () => {
            expect(
                getAccountName({
                    accountCategory: 'trading',
                    accountType: undefined,
                    landingCompanyName: 'svg',
                })
            ).toBe('');
        });

        it('returns empty string for unknown MT5 market type', () => {
            expect(
                getAccountName({
                    accountCategory: 'trading',
                    accountType: PlatformDetails.mt5.name,
                    landingCompanyName: 'svg',
                    mt5MarketType: undefined,
                })
            ).toBe('');
        });
    });
});
