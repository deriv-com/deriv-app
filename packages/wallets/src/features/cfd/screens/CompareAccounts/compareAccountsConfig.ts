import { useTranslations } from '@deriv-com/translations';
import getInstrumentsIcons from '../../../../public/images/tradingInstruments';
import { THooks, TPlatforms } from '../../../../types';
import { CFD_PLATFORMS, MARKET_TYPE, PRODUCT } from '../../constants';
import { JURISDICTION, MARKET_TYPE_SHORTCODE } from './constants';

type THighlightedIconLabel = {
    highlighted: boolean;
    icon: keyof ReturnType<typeof getInstrumentsIcons>;
    isAsterisk?: boolean;
    text: string;
};

type TMarketTypes = THooks.AvailableMT5Accounts['market_type'];
type TShortCode = THooks.AvailableMT5Accounts['shortcode'];

const getHighlightedIconLabel = (
    platform: TPlatforms.All,
    isEuRegion: boolean,
    localize: ReturnType<typeof useTranslations>['localize'],
    marketType: TMarketTypes,
    shortCode: TShortCode,
    product?: THooks.AvailableMT5Accounts['product']
): THighlightedIconLabel[] => {
    const marketTypeShortCode =
        platform === CFD_PLATFORMS.MT5 && marketType === 'all'
            ? `${marketType}_${product}_${shortCode}`
            : marketType?.concat('_', shortCode ?? '');

    const forexLabel = (() => {
        if (isEuRegion) {
            return localize('Forex');
        } else if (marketTypeShortCode === MARKET_TYPE_SHORTCODE.FINANCIAL_LABUAN) {
            return localize('Forex: standard/exotic');
        } else if (
            (platform === CFD_PLATFORMS.MT5 && marketTypeShortCode === MARKET_TYPE_SHORTCODE.ALL_SWAP_FREE_SVG) ||
            platform === CFD_PLATFORMS.CTRADER
        ) {
            return localize('Forex: major/minor');
        } else if (
            marketType === MARKET_TYPE.SYNTHETIC ||
            (platform === CFD_PLATFORMS.MT5 && marketTypeShortCode === MARKET_TYPE_SHORTCODE.ALL_ZERO_SPREAD_BVI)
        ) {
            return localize('Forex: standard');
        }
        return localize('Forex: standard/micro');
    })();

    switch (marketType) {
        case MARKET_TYPE.SYNTHETIC:
            return [
                { highlighted: true, icon: 'Forex', text: forexLabel },
                { highlighted: true, icon: 'Stocks', text: localize('Stocks') },
                { highlighted: true, icon: 'StockIndices', text: localize('Stock indices') },
                { highlighted: true, icon: 'Commodities', text: localize('Commodities') },
                { highlighted: true, icon: 'Cryptocurrencies', text: localize('Cryptocurrencies') },
                { highlighted: true, icon: 'ETF', text: localize('ETFs') },
                { highlighted: true, icon: 'Synthetics', text: localize('Synthetic indices') },
                { highlighted: true, icon: 'Baskets', text: localize('Basket indices') },
                { highlighted: true, icon: 'DerivedFX', text: localize('Derived FX') },
            ];
        case MARKET_TYPE.FINANCIAL:
            switch (shortCode) {
                case JURISDICTION.MALTAINVEST:
                    return [
                        { highlighted: true, icon: 'Forex', text: forexLabel },
                        { highlighted: true, icon: 'Stocks', text: localize('Stocks') },
                        { highlighted: true, icon: 'StockIndices', text: localize('Stock indices') },
                        { highlighted: true, icon: 'Commodities', text: localize('Commodities') },
                        { highlighted: true, icon: 'Cryptocurrencies', text: localize('Cryptocurrencies') },
                        {
                            highlighted: true,
                            icon: 'Synthetics',
                            isAsterisk: true,
                            text: localize('Synthetic indices'),
                        },
                    ];
                case JURISDICTION.LABUAN:
                    return [
                        { highlighted: true, icon: 'Forex', text: forexLabel },
                        { highlighted: false, icon: 'Stocks', text: localize('Stocks') },
                        { highlighted: false, icon: 'StockIndices', text: localize('Stock indices') },
                        { highlighted: false, icon: 'Commodities', text: localize('Commodities') },
                        { highlighted: true, icon: 'Cryptocurrencies', text: localize('Cryptocurrencies') },
                        { highlighted: false, icon: 'ETF', text: localize('ETFs') },
                        { highlighted: false, icon: 'Synthetics', text: localize('Synthetic indices') },
                        { highlighted: false, icon: 'Baskets', text: localize('Basket indices') },
                        { highlighted: false, icon: 'DerivedFX', text: localize('Derived FX') },
                    ];
                default:
                    return [
                        { highlighted: true, icon: 'Forex', text: forexLabel },
                        { highlighted: true, icon: 'Stocks', text: localize('Stocks') },
                        { highlighted: true, icon: 'StockIndices', text: localize('Stock indices') },
                        { highlighted: true, icon: 'Commodities', text: localize('Commodities') },
                        { highlighted: true, icon: 'Cryptocurrencies', text: localize('Cryptocurrencies') },
                        { highlighted: true, icon: 'ETF', text: localize('ETFs') },
                        { highlighted: false, icon: 'Synthetics', text: localize('Synthetic indices') },
                        { highlighted: false, icon: 'Baskets', text: localize('Basket indices') },
                        { highlighted: false, icon: 'DerivedFX', text: localize('Derived FX') },
                    ];
            }
        case MARKET_TYPE.ALL:
        default:
            if (platform === CFD_PLATFORMS.MT5) {
                if (product === PRODUCT.ZEROSPREAD) {
                    return [
                        { highlighted: true, icon: 'Forex', text: forexLabel },
                        { highlighted: false, icon: 'Stocks', text: localize('Stocks') },
                        { highlighted: true, icon: 'StockIndices', text: localize('Stock indices') },
                        { highlighted: true, icon: 'Commodities', text: localize('Commodities') },
                        { highlighted: true, icon: 'Cryptocurrencies', text: localize('Cryptocurrencies') },
                        { highlighted: false, icon: 'ETF', text: localize('ETFs') },
                        { highlighted: true, icon: 'Synthetics', text: localize('Synthetic indices') },
                        { highlighted: true, icon: 'Baskets', text: localize('Basket indices') },
                        { highlighted: true, icon: 'DerivedFX', text: localize('Derived FX') },
                    ];
                }
                return [
                    { highlighted: true, icon: 'Forex', text: forexLabel },
                    { highlighted: true, icon: 'Stocks', text: localize('Stocks') },
                    { highlighted: true, icon: 'StockIndices', text: localize('Stock indices') },
                    { highlighted: true, icon: 'Commodities', text: localize('Commodities') },
                    { highlighted: true, icon: 'Cryptocurrencies', text: localize('Cryptocurrencies') },
                    { highlighted: true, icon: 'ETF', text: localize('ETFs') },
                    { highlighted: true, icon: 'Synthetics', text: localize('Synthetics indices') },
                    { highlighted: false, icon: 'Baskets', text: localize('Basket indices') },
                    { highlighted: false, icon: 'DerivedFX', text: localize('Derived FX') },
                ];
            }
            return [
                { highlighted: true, icon: 'Forex', text: forexLabel },
                { highlighted: true, icon: 'Stocks', text: localize('Stocks') },
                { highlighted: true, icon: 'StockIndices', text: localize('Stock indices') },
                { highlighted: true, icon: 'Commodities', text: localize('Commodities') },
                { highlighted: true, icon: 'Cryptocurrencies', text: localize('Cryptocurrencies') },
                { highlighted: true, icon: 'ETF', text: localize('ETFs') },
                { highlighted: true, icon: 'Synthetics', text: localize('Synthetic indices') },
                { highlighted: true, icon: 'Baskets', text: localize('Basket indices') },
                { highlighted: true, icon: 'DerivedFX', text: localize('Derived FX') },
            ];
    }
};

const getPlatformType = (platform: TPlatforms.All) => {
    switch (platform) {
        case CFD_PLATFORMS.MT5:
            return 'MT5';
        case CFD_PLATFORMS.CTRADER:
            return 'CTrader';
        case CFD_PLATFORMS.DXTRADE:
            return 'DerivX';
        default:
            return 'OtherCFDs';
    }
};

const cfdConfig = (localize: ReturnType<typeof useTranslations>['localize']) => ({
    leverage: localize('Up to 1:1000'),
    leverage_description: localize('Maximum leverage'),
    spread: localize('0.5 pips'),
    spread_description: localize('Spreads from'),
});

const getJurisdictionDescription = (localize: ReturnType<typeof useTranslations>['localize'], shortcode?: string) => {
    switch (shortcode) {
        case MARKET_TYPE_SHORTCODE.SYNTHETIC_BVI:
        case MARKET_TYPE_SHORTCODE.FINANCIAL_BVI:
            return { ...cfdConfig(localize) };
        case MARKET_TYPE_SHORTCODE.SYNTHETIC_VANUATU:
        case MARKET_TYPE_SHORTCODE.FINANCIAL_VANUATU:
            return { ...cfdConfig(localize) };
        case MARKET_TYPE_SHORTCODE.FINANCIAL_LABUAN:
            return {
                ...cfdConfig(localize),
                leverage: localize('Up to 1:100'),
                spread: localize('0.6 pips'),
            };
        case MARKET_TYPE_SHORTCODE.FINANCIAL_MALTAINVEST:
            return {
                ...cfdConfig(localize),
                leverage: localize('Up to 1:30'),
            };
        case MARKET_TYPE_SHORTCODE.ALL_ZERO_SPREAD_BVI:
            return {
                ...cfdConfig(localize),
                spread: localize('0.0 pips'),
            };
        case MARKET_TYPE_SHORTCODE.ALL_DXTRADE:
        case MARKET_TYPE_SHORTCODE.ALL_SVG:
        case MARKET_TYPE_SHORTCODE.SYNTHETIC_SVG:
        case MARKET_TYPE_SHORTCODE.FINANCIAL_SVG:
        default:
            return cfdConfig(localize);
    }
};

export { getHighlightedIconLabel, getJurisdictionDescription, getPlatformType };
