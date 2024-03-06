import InstrumentsIcons from '@/assets/cfd/tradingInstruments';
import { THooks, TPlatforms } from '../../../../types';
import { CFDPlatforms, MarketType } from '../../constants';
import { Jurisdiction, MarketTypeShortcode } from './constants';

type THighlightedIconLabel = {
    highlighted: boolean;
    icon: keyof typeof InstrumentsIcons;
    isAsterisk?: boolean;
    text: string;
};

type TMarketTypes = THooks.AvailableMT5Accounts['market_type'];
type TShortCode = THooks.AvailableMT5Accounts['shortcode'];

const getHighlightedIconLabel = (
    platform: TPlatforms.All,
    isEuRegion: boolean,
    marketType: TMarketTypes,
    shortCode: TShortCode
): THighlightedIconLabel[] => {
    const marketTypeShortCode = marketType?.concat('_', shortCode ?? '');

    const forexLabel = (() => {
        if (isEuRegion) {
            return 'Forex';
        } else if (marketTypeShortCode === MarketTypeShortcode.FINANCIAL_LABUAN) {
            return 'Forex: standard/exotic';
        } else if (
            (platform === CFDPlatforms.MT5 && marketTypeShortCode === MarketTypeShortcode.ALL_SVG) ||
            platform === CFDPlatforms.CTRADER
        ) {
            return 'Forex: major/minor';
        }
        return 'Forex: standard/micro';
    })();

    switch (marketType) {
        case MarketType.SYNTHETIC:
            return [
                { highlighted: false, icon: 'Forex', text: forexLabel },
                { highlighted: false, icon: 'Stocks', text: 'Stocks' },
                { highlighted: false, icon: 'StockIndices', text: 'Stock indices' },
                { highlighted: false, icon: 'Commodities', text: 'Commodities' },
                { highlighted: false, icon: 'Cryptocurrencies', text: 'Cryptocurrencies' },
                { highlighted: false, icon: 'ETF', text: 'ETFs' },
                { highlighted: true, icon: 'Synthetics', text: 'Synthetic indices' },
                { highlighted: true, icon: 'Baskets', text: 'Basket indices' },
                { highlighted: true, icon: 'DerivedFX', text: 'Derived FX' },
            ];
        case MarketType.FINANCIAL:
            switch (shortCode) {
                case Jurisdiction.MALTAINVEST:
                    return [
                        { highlighted: true, icon: 'Forex', text: forexLabel },
                        { highlighted: true, icon: 'Stocks', text: 'Stocks' },
                        { highlighted: true, icon: 'StockIndices', text: 'Stock indices' },
                        { highlighted: true, icon: 'Commodities', text: 'Commodities' },
                        { highlighted: true, icon: 'Cryptocurrencies', text: 'Cryptocurrencies' },
                        { highlighted: true, icon: 'Synthetics', isAsterisk: true, text: 'Synthetic indices' },
                    ];
                case Jurisdiction.LABUAN:
                    return [
                        { highlighted: true, icon: 'Forex', text: forexLabel },
                        { highlighted: false, icon: 'Stocks', text: 'Stocks' },
                        { highlighted: false, icon: 'StockIndices', text: 'Stock indices' },
                        { highlighted: false, icon: 'Commodities', text: 'Commodities' },
                        { highlighted: true, icon: 'Cryptocurrencies', text: 'Cryptocurrencies' },
                        { highlighted: false, icon: 'ETF', text: 'ETFs' },
                        { highlighted: false, icon: 'Synthetics', text: 'Synthetic indices' },
                        { highlighted: false, icon: 'Baskets', text: 'Basket indices' },
                        { highlighted: false, icon: 'DerivedFX', text: 'Derived FX' },
                    ];
                default:
                    return [
                        { highlighted: true, icon: 'Forex', text: forexLabel },
                        { highlighted: true, icon: 'Stocks', text: 'Stocks' },
                        { highlighted: true, icon: 'StockIndices', text: 'Stock indices' },
                        { highlighted: true, icon: 'Commodities', text: 'Commodities' },
                        { highlighted: true, icon: 'Cryptocurrencies', text: 'Cryptocurrencies' },
                        { highlighted: true, icon: 'ETF', text: 'ETFs' },
                        { highlighted: false, icon: 'Synthetics', text: 'Synthetic indices' },
                        { highlighted: false, icon: 'Baskets', text: 'Basket indices' },
                        { highlighted: false, icon: 'DerivedFX', text: 'Derived FX' },
                    ];
            }
        case MarketType.ALL:
        default:
            if (platform === CFDPlatforms.MT5) {
                return [
                    { highlighted: true, icon: 'Forex', text: forexLabel },
                    { highlighted: true, icon: 'Stocks', text: 'Stocks' },
                    { highlighted: true, icon: 'StockIndices', text: 'Stock indices' },
                    { highlighted: true, icon: 'Commodities', text: 'Commodities' },
                    { highlighted: true, icon: 'Cryptocurrencies', text: 'Cryptocurrencies' },
                    { highlighted: true, icon: 'ETF', text: 'ETFs' },
                    { highlighted: true, icon: 'Synthetics', text: 'Synthetics indices' },
                    { highlighted: false, icon: 'Baskets', text: 'Basket indices' },
                    { highlighted: false, icon: 'DerivedFX', text: 'Derived FX' },
                ];
            }
            return [
                { highlighted: true, icon: 'Forex', text: forexLabel },
                { highlighted: true, icon: 'Stocks', text: 'Stocks' },
                { highlighted: true, icon: 'StockIndices', text: 'Stock indices' },
                { highlighted: true, icon: 'Commodities', text: 'Commodities' },
                { highlighted: true, icon: 'Cryptocurrencies', text: 'Cryptocurrencies' },
                { highlighted: true, icon: 'ETF', text: 'ETFs' },
                { highlighted: true, icon: 'Synthetics', text: 'Synthetic indices' },
                { highlighted: true, icon: 'Baskets', text: 'Basket indices' },
                { highlighted: true, icon: 'DerivedFX', text: 'Derived FX' },
            ];
    }
};

const getPlatformType = (platform: TPlatforms.All) => {
    switch (platform) {
        case CFDPlatforms.MT5:
            return 'MT5';
        case CFDPlatforms.CTRADER:
            return 'CTrader';
        case CFDPlatforms.DXTRADE:
        default:
            return 'DerivX';
    }
};

const cfdConfig = {
    counterpartyCompany: 'Deriv (SVG) LLC',
    counterpartyCompanyDescription: 'Counterparty company',
    jurisdiction: 'St. Vincent & Grenadines',
    jurisdictionDescription: 'Jurisdiction',
    leverage: '1:1000',
    leverageDescription: 'Maximum leverage',
    regulator: 'Financial Commission',
    regulatorDescription: 'Regulator/External dispute resolution',
    regulatorLicense: '',
    spread: '0.5 pips',
    spreadDescription: 'Spreads from',
};

const getJurisdictionDescription = (shortcode?: string) => {
    switch (shortcode) {
        case MarketTypeShortcode.SYNTHETIC_BVI:
        case MarketTypeShortcode.FINANCIAL_BVI:
            return {
                ...cfdConfig,
                counterpartyCompany: 'Deriv (BVI) Ltd',
                jurisdiction: 'British Virgin Islands',
                regulator: 'British Virgin Islands Financial Services Commission',
                regulatorDescription: 'Regulator/External dispute resolution',
                regulatorLicense: '(License no. SIBA/L/18/1114)',
            };
        case MarketTypeShortcode.SYNTHETIC_VANUATU:
        case MarketTypeShortcode.FINANCIAL_VANUATU:
            return {
                ...cfdConfig,
                counterpartyCompany: 'Deriv (V) Ltd',
                jurisdiction: 'Vanuatu',
                regulator: 'Vanuatu Financial Services Commission',
                regulatorDescription: 'Regulator/External dispute resolution',
                regulatorLicense: '',
            };
        case MarketTypeShortcode.FINANCIAL_LABUAN:
            return {
                ...cfdConfig,
                counterpartyCompany: 'Deriv (FX) Ltd',
                jurisdiction: 'Labuan',
                leverage: '1:100',
                regulator: 'Labuan Financial Services Authority',
                regulatorDescription: 'Regulator/External dispute resolution',
                regulatorLicense: '(License no. MB/18/0024)',
            };
        case MarketTypeShortcode.FINANCIAL_MALTAINVEST:
            return {
                ...cfdConfig,
                counterpartyCompany: 'Deriv Investments (Europe) Limited',
                jurisdiction: 'Malta',
                leverage: '1:30',
                regulator: 'Financial Commission',
                regulatorDescription: '',
                regulatorLicense: 'Regulated by the Malta Financial Services Authority (MFSA) (licence no. IS/70156)',
            };
        case MarketTypeShortcode.ALL_DXTRADE:
        case MarketTypeShortcode.ALL_SVG:
        case MarketTypeShortcode.SYNTHETIC_SVG:
        case MarketTypeShortcode.FINANCIAL_SVG:
        default:
            return cfdConfig;
    }
};

const acknowledgedStatus = ['pending', 'verified'];

const getPoiAcknowledgedForMaltainvest = (authenticationInfo?: THooks.Authentication) => {
    const services = authenticationInfo?.identity?.services ?? {};
    const { manual: { status: manualStatus } = {}, onfido: { status: onfidoStatus } = {} } = services;

    return [onfidoStatus, manualStatus].some(status => acknowledgedStatus.includes(status ?? ''));
};

const getPoiAcknowledgedForBviLabuanVanuatu = (authenticationInfo?: THooks.Authentication) => {
    const services = authenticationInfo?.identity?.services ?? {};
    const riskClassification = authenticationInfo?.risk_classification ?? '';
    const {
        idv: { status: idvStatus } = {},
        manual: { status: manualStatus } = {},
        onfido: { status: onfidoStatus } = {},
    } = services;

    if (riskClassification === 'high') {
        return Boolean(onfidoStatus && acknowledgedStatus.includes(onfidoStatus));
    }
    return [idvStatus, onfidoStatus, manualStatus].some(status => acknowledgedStatus.includes(status ?? ''));
};

const shouldRestrictBviAccountCreation = (mt5Accounts: THooks.MT5AccountsList[]) =>
    !!mt5Accounts.filter(item => item?.landing_company_short === 'bvi' && item?.status === 'poa_failed').length;

const shouldRestrictVanuatuAccountCreation = (mt5Accounts: THooks.MT5AccountsList[]) =>
    !!mt5Accounts.filter(item => item?.landing_company_short === 'vanuatu' && item?.status === 'poa_failed').length;

const getAccountVerificationStatus = (
    shortCode: THooks.AvailableMT5Accounts['shortcode'],
    shouldRestrictBviAccountCreation: boolean,
    shouldRestrictVanuatuAccountCreation: boolean,
    hasSubmittedPersonalDetails: boolean,
    authenticationInfo?: THooks.Authentication,
    isDemo?: boolean
) => {
    const {
        has_poa_been_attempted: hasPoaBeenAttempted,
        has_poi_been_attempted: hasPoiBeenAttempted,
        poa_status: poaStatus,
    } = authenticationInfo || {};
    const poiOrPoaNotSubmitted = !hasPoaBeenAttempted || !hasPoiBeenAttempted;
    const poaAcknowledged = acknowledgedStatus.includes(poaStatus ?? '');

    const poiAcknowledgedForMaltainvest = getPoiAcknowledgedForMaltainvest(authenticationInfo);
    const poiAcknowledgedForBviLabuanVanuatu = getPoiAcknowledgedForBviLabuanVanuatu(authenticationInfo);

    if (shortCode === Jurisdiction.SVG) {
        return true;
    }
    if (shortCode === Jurisdiction.BVI) {
        return (
            poiAcknowledgedForBviLabuanVanuatu &&
            !poiOrPoaNotSubmitted &&
            !shouldRestrictBviAccountCreation &&
            hasSubmittedPersonalDetails &&
            poaAcknowledged
        );
    }
    if (shortCode === Jurisdiction.VANUATU) {
        return (
            poiAcknowledgedForBviLabuanVanuatu &&
            !poiOrPoaNotSubmitted &&
            !shouldRestrictVanuatuAccountCreation &&
            hasSubmittedPersonalDetails &&
            poaAcknowledged
        );
    }
    if (shortCode === Jurisdiction.LABUAN) {
        return poiAcknowledgedForBviLabuanVanuatu && poaAcknowledged && hasSubmittedPersonalDetails;
    }
    if (shortCode === Jurisdiction.MALTAINVEST) {
        return (poiAcknowledgedForMaltainvest && poaAcknowledged) || isDemo;
    }
};

const isMt5AccountAdded = (
    list: THooks.MT5AccountsList[],
    marketType: TMarketTypes,
    companyShortCode: string,
    isDemo?: boolean
) =>
    list.some(item => {
        const currentAccountType = isDemo ? 'demo' : 'real';
        return (
            item.account_type === currentAccountType &&
            item.market_type === marketType &&
            item.landing_company_short === companyShortCode &&
            item.platform === CFDPlatforms.MT5
        );
    });

const isDxtradeAccountAdded = (list: THooks.DxtradeAccountsList[], isDemo?: boolean) =>
    list.some(item => {
        const currentAccountType = isDemo ? 'demo' : 'real';
        return item.account_type === currentAccountType && item.platform === CFDPlatforms.DXTRADE;
    });

const isCTraderAccountAdded = (list: THooks.CtraderAccountsList[], isDemo?: boolean) =>
    list.some(item => {
        const currentAccountType = isDemo ? 'demo' : 'real';
        return item.account_type === currentAccountType && item.platform === CFDPlatforms.CTRADER;
    });

export {
    getAccountVerificationStatus,
    getHighlightedIconLabel,
    getJurisdictionDescription,
    getPlatformType,
    isCTraderAccountAdded,
    isDxtradeAccountAdded,
    isMt5AccountAdded,
    shouldRestrictBviAccountCreation,
    shouldRestrictVanuatuAccountCreation,
};
