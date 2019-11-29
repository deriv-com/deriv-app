import { localize } from 'deriv-translations';

export const getMarketNamesMap = () => ({
    FRXAUDCAD : localize('AUD/CAD'),
    FRXAUDCHF : localize('AUD/CHF'),
    FRXAUDJPY : localize('AUD/JPY'),
    FRXAUDNZD : localize('AUD/NZD'),
    FRXAUDPLN : localize('AUD/PLN'),
    FRXAUDUSD : localize('AUD/USD'),
    FRXBROUSD : localize('Oil/USD'),
    FRXEURAUD : localize('EUR/AUD'),
    FRXEURCAD : localize('EUR/CAD'),
    FRXEURCHF : localize('EUR/CHF'),
    FRXEURGBP : localize('EUR/GBP'),
    FRXEURJPY : localize('EUR/JPY'),
    FRXEURNZD : localize('EUR/NZD'),
    FRXEURUSD : localize('EUR/USD'),
    FRXGBPAUD : localize('GBP/AUD'),
    FRXGBPCAD : localize('GBP/CAD'),
    FRXGBPCHF : localize('GBP/CHF'),
    FRXGBPJPY : localize('GBP/JPY'),
    FRXGBPNOK : localize('GBP/NOK'),
    FRXGBPUSD : localize('GBP/USD'),
    FRXNZDJPY : localize('NZD/JPY'),
    FRXNZDUSD : localize('NZD/USD'),
    FRXUSDCAD : localize('USD/CAD'),
    FRXUSDCHF : localize('USD/CHF'),
    FRXUSDJPY : localize('USD/JPY'),
    FRXUSDNOK : localize('USD/NOK'),
    FRXUSDPLN : localize('USD/PLN'),
    FRXUSDSEK : localize('USD/SEK'),
    FRXXAGUSD : localize('Silver/USD'),
    FRXXAUUSD : localize('Gold/USD'),
    FRXXPDUSD : localize('Palladium/USD'),
    FRXXPTUSD : localize('Platinum/USD'),
    OTC_AEX   : localize('Dutch Index'),
    OTC_AS51  : localize('Australian Index'),
    OTC_DJI   : localize('Wall Street Index'),
    OTC_FCHI  : localize('French Index'),
    OTC_FTSE  : localize('UK Index'),
    OTC_GDAXI : localize('German Index'),
    OTC_HSI   : localize('Hong Kong Index'),
    OTC_IBEX35: localize('Spanish Index'),
    OTC_N225  : localize('Japanese Index'),
    OTC_NDX   : localize('US Tech Index'),
    OTC_SPC   : localize('US Index'),
    OTC_SSMI  : localize('Swiss Index'),
    OTC_SX5E  : localize('Euro 50 Index'),
    R_10      : localize('Volatility 10 Index'),
    R_25      : localize('Volatility 25 Index'),
    R_50      : localize('Volatility 50 Index'),
    R_75      : localize('Volatility 75 Index'),
    R_100     : localize('Volatility 100 Index'),
    RDBEAR    : localize('Bear Market Index'),
    RDBULL    : localize('Bull Market Index'),
    WLDAUD    : localize('AUD Index'),
    WLDEUR    : localize('EUR Index'),
    WLDGBP    : localize('GBP Index'),
    WLDUSD    : localize('USD Index'),
    '1HZ10V'  : localize('Volatility 10 (1s) Index'),
    '1HZ100V' : localize('Volatility 100 (1s) Index'),
});

export const getUnsupportedContracts = () => ({
    EXPIRYMISS: {
        name    : localize('Ends Outside'),
        position: 'top',
    },
    EXPIRYRANGE: {
        name    : localize('Ends Between'),
        position: 'bottom',
    },
    RANGE: {
        name    : localize('Stays Between'),
        position: 'top',
    },
    UPORDOWN: {
        name    : localize('Goes Outside'),
        position: 'bottom',
    },
    RESETCALL: {
        name    : localize('Reset Call'),
        position: 'top',
    },
    RESETPUT: {
        name    : localize('Reset Put'),
        position: 'bottom',
    },
    TICKHIGH: {
        name    : localize('High Tick'),
        position: 'top',
    },
    TICKLOW: {
        name    : localize('Low Tick'),
        position: 'bottom',
    },
    ASIANU: {
        name    : localize('Asian Up'),
        position: 'top',
    },
    ASIAND: {
        name    : localize('Asian Down'),
        position: 'bottom',
    },
    LBFLOATCALL: {
        name    : localize('Close-Low'),
        position: 'top',
    },
    LBFLOATPUT: {
        name    : localize('High-Close'),
        position: 'top',
    },
    LBHIGHLOW: {
        name    : localize('High-Low'),
        position: 'top',
    },
    CALLSPREAD: {
        name    : localize('Call Spread'),
        position: 'top',
    },
    PUTSPREAD: {
        name    : localize('Put Spread'),
        position: 'bottom',
    },
    RUNHIGH: {
        name    : localize('Only Ups'),
        position: 'top',
    },
    RUNLOW: {
        name    : localize('Only Downs'),
        position: 'bottom',
    },
});

export const getSupportedContracts = is_high_low => ({
    CALL: {
        name    : is_high_low ?  localize('Higher') : localize('Rise'),
        position: 'top',
    },
    PUT: {
        name    : is_high_low ? localize('Lower') : localize('Fall'),
        position: 'bottom',
    },
    CALLE: {
        name    : localize('Rise'),
        position: 'top',
    },
    PUTE: {
        name    : localize('Fall'),
        position: 'bottom',
    },
    DIGITMATCH: {
        name    : localize('Matches'),
        position: 'top',
    },
    DIGITDIFF: {
        name    : localize('Differs'),
        position: 'bottom',
    },
    DIGITEVEN: {
        name    : localize('Even'),
        position: 'top',
    },
    DIGITODD: {
        name    : localize('Odd'),
        position: 'bottom',
    },
    DIGITOVER: {
        name    : localize('Over'),
        position: 'top',
    },
    DIGITUNDER: {
        name    : localize('Under'),
        position: 'bottom',
    },
    ONETOUCH: {
        name    : localize('Touch'),
        position: 'top',
    },
    NOTOUCH: {
        name    : localize('No Touch'),
        position: 'bottom',
    },
});

export const getContractConfig = is_high_low => ({
    ...getSupportedContracts(is_high_low),
    ...getUnsupportedContracts(),
});

export const getContractTypeDisplay  = (
    type,
    is_high_low = false) => (
    getContractConfig(is_high_low)[type] ? getContractConfig(is_high_low)[type.toUpperCase()].name : ''
);

export const getContractTypePosition = (
    type,
    is_high_low = false) => (
    getContractConfig(is_high_low)[type] ? getContractConfig(is_high_low)[type.toUpperCase()].position : 'top'
);
