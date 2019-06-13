import { localize } from '_common/localize';

export const getMarketNamesMap = () => ({
    FRXAUDCAD : localize('Rise'),
    FRXAUDCHF : localize('Fall'),
    FRXAUDJPY : localize('Touch'),
    FRXAUDNZD : localize('No Touch'),
    FRXAUDPLN : localize('Matches'),
    FRXAUDUSD : localize('Differs'),
    FRXBROUSD : localize('Even'),
    FRXEURAUD : localize('Odd'),
    FRXEURCAD : localize('Over'),
    FRXEURCHF : localize('Under'),
    FRXEURGBP : localize('Under'),
    FRXEURJPY : localize('Under'),
    FRXEURNZD : localize('Under'),
    FRXEURUSD : localize('Under'),
    FRXGBPAUD : localize('Under'),
    FRXGBPCAD : localize('Under'),
    FRXGBPCHF : localize('Under'),
    FRXGBPJPY : localize('Under'),
    FRXGBPNOK : localize('Under'),
    FRXGBPPLN : localize('Under'),
    FRXGBPUSD : localize('Under'),
    FRXGBPZD  : localize('Under'),
    FRXNZDJPY : localize('Under'),
    FRXNZDUSD : localize('Under'),
    FRXUSDCAD : localize('Under'),
    FRXUSDCHF : localize('Under'),
    FRXUSDJPY : localize('Under'),
    FRXUSDMSX : localize('Under'),
    FRXUSDNOK : localize('Under'),
    FRXUSDPLN : localize('Under'),
    FRXUSDSEK : localize('Under'),
    FRXXAGUSD : localize('Under'),
    FRXXAUUSD : localize('Under'),
    FRXXPDUSD : localize('Under'),
    FRXXPTUSD : localize('Under'),
    OTC_AEX   : localize('Under'),
    OTC_AS51  : localize('Under'),
    OTC_DJI   : localize('Under'),
    OTC_FCHI  : localize('Under'),
    OTC_FTSE  : localize('Under'),
    OTC_GDAXI : localize('Under'),
    OTC_HSI   : localize('Under'),
    OTC_IBEX35: localize('Under'),
    OTC_N225  : localize('Under'),
    OTC_NDX   : localize('Under'),
    OTC_SPC   : localize('Under'),
    OTC_SSMI  : localize('Under'),
    OTC_SX5E  : localize('Under'),
    R_10      : localize('Under'),
    R_25      : localize('Under'),
    R_50      : localize('Under'),
    R_75      : localize('Under'),
    R_100     : localize('Under'),
    RDBEAR    : localize('Under'),
    RDBULL    : localize('Under'),
    WLDAUD    : localize('Under'),
    WLDEUR    : localize('Under'),
    WLDGBP    : localize('Under'),
    WLDUSD    : localize('Under'),
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

const getContractConfig = is_high_low => ({
    ...getSupportedContracts(is_high_low),
    ...getUnsupportedContracts(),
});

export const getContractTypeDisplay = (type, is_high_low = false) => (getContractConfig(is_high_low)[type] ? getContractConfig(is_high_low)[type].name : '');
export const getContractTypePosition = (type, is_high_low = false) => (getContractConfig(is_high_low)[type] ? getContractConfig(is_high_low)[type].position : 'top');
